    // Désactivation du menu contextuel (clic droit)
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    let isDragging = false;
    let startX, startY;
    let offsetX = 0, offsetY = 0; 
    let zoomLevel = 1; 
    let lastZoomLevel = zoomLevel; 
    const moveLimit = 500; 

    const tableListContainer = document.getElementById('tableListContainer');
    const tableListElement = document.getElementById('tableList');
    const moveArea = document.getElementById('moveArea');
    const errorMessageElement = document.getElementById('errorMessage');

    moveArea.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
        tableListContainer.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            offsetX = e.clientX - startX;
            offsetY = e.clientY - startY;

            offsetX = Math.min(Math.max(offsetX, -moveLimit), moveLimit);

            const gridHeight = tableListElement.offsetHeight * zoomLevel; 
            const containerHeight = tableListContainer.offsetHeight;
            offsetY = Math.min(Math.max(offsetY, -(gridHeight - containerHeight + moveLimit)), moveLimit);

            tableListElement.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
            drawRelations(); 
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        tableListContainer.style.cursor = 'grab';
    });

    tableListContainer.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const zoomChange = e.deltaY > 0 ? -0.1 : 0.1;
            zoomLevel = Math.min(Math.max(zoomLevel + zoomChange, 0.5), 3);
            tableListElement.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
            drawRelations(); 
        }
    });

    document.getElementById('sqlFile').addEventListener('change', handleFileUpload);

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file && file.name.endsWith('.sql')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const sqlContent = e.target.result;
                const tables = extractTablesAndFields(sqlContent);
                displayTables(tables);
                drawRelations(); 
            };
            reader.readAsText(file);
        } else {
            alert("Veuillez télécharger un fichier .sql");
        }
    }

    function extractTablesAndFields(sqlContent) {
        const cleanedSQL = sqlContent.replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '');
        const lines = cleanedSQL.split('\n');
        const tables = [];
        let currentTable = null;
        let currentFields = [];
        let currentConstraints = [];
        let foreignKeys = [];
        let isInTableDefinition = false;

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('CREATE TABLE')) {
                if (currentTable) {
                    tables.push({ name: currentTable, fields: currentFields, constraints: currentConstraints, foreignKeys: foreignKeys });
                }
                currentTable = line.match(/`([^`]+)`/)[1];
                currentFields = [];
                currentConstraints = [];
                foreignKeys = [];
                isInTableDefinition = true;
            }

            if (isInTableDefinition) {
                if (line.includes('`')) {
                    const parts = line.split('`');
                    const field = parts[1];

                    const constraints = [];
                    if (line.includes('PRIMARY KEY')) {
                        constraints.push('PRIMARY KEY');
                    }
                    if (line.includes('UNIQUE')) {
                        constraints.push('UNIQUE');
                    }
                    if (line.includes('FOREIGN KEY')) {
                        const foreignKeyMatch = line.match(/FOREIGN KEY \(`([^`]+)`\) REFERENCES `([^`]+)` \(`([^`]+)`\)/);
                        if (foreignKeyMatch) {
                            foreignKeys.push({
                                field: foreignKeyMatch[1],
                                referencedTable: foreignKeyMatch[2],
                                referencedField: foreignKeyMatch[3]
                            });
                        }
                        constraints.push('FOREIGN KEY');
                    }

                    if (field) {
                        currentFields.push({ name: field, constraints: constraints.join(', ') });
                    }
                }
            }

            if (line.includes(');')) {
                tables.push({ name: currentTable, fields: currentFields, constraints: currentConstraints, foreignKeys: foreignKeys });
                currentTable = null;
                currentFields = [];
                currentConstraints = [];
                foreignKeys = [];
                isInTableDefinition = false;
            }
        });

        return tables;
    }

    function displayTables(tables) {
        tableListElement.innerHTML = '';
        errorMessageElement.innerHTML = '';

        if (tables.length > 0) {
            tables.forEach((table, index) => {
                const tableCard = document.createElement('div');
                tableCard.classList.add('table-card');

                const tableName = document.createElement('h3');
                tableName.classList.add('table-name');
                tableName.textContent = table.name;
                tableCard.appendChild(tableName);

                const fieldList = document.createElement('div');
                fieldList.classList.add('field-list');
                table.fields.forEach(field => {
                    const fieldItem = document.createElement('div');
                    fieldItem.textContent = `${field.name} ${field.constraints}`;
                    fieldList.appendChild(fieldItem);
                });
                tableCard.appendChild(fieldList);

                tableListElement.appendChild(tableCard);
            });
        } else {
            errorMessageElement.textContent = 'Aucune table trouvée.';
        }
    }

    function drawRelations() {
        // Supprimer les anciennes lignes de relation
        document.querySelectorAll('.relation-line').forEach(line => line.remove());

        const tables = Array.from(tableListElement.children);

        tables.forEach((table, tableIndex) => {
            const tableData = extractTablesAndFields(sqlContent)[tableIndex];

            tableData.foreignKeys.forEach(fk => {
                const sourceRect = table.getBoundingClientRect();
                const targetTable = tables.find(t => t.querySelector('.table-name').textContent === fk.referencedTable);
                if (targetTable) {
                    const targetRect = targetTable.getBoundingClientRect();

                    const line = document.createElement('div');
                    line.classList.add('relation-line');

                    const scaleX = zoomLevel;
                    const scaleY = zoomLevel;

                    // Calcule la position et la largeur de la ligne en prenant en compte le zoom
                    line.style.width = `${Math.abs(targetRect.left - sourceRect.left)}px`;
                    line.style.top = `${(sourceRect.top + sourceRect.height / 2) - tableListContainer.offsetTop}px`;
                    line.style.left = `${(sourceRect.left - tableListContainer.offsetLeft)}px`;
                    line.style.transform = `rotate(${Math.atan2(targetRect.top - sourceRect.top, targetRect.left - sourceRect.left)}rad)`;

                    tableListContainer.appendChild(line);
                }
            });
        });
    }