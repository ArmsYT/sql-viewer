# 🗂️ SQL Table Visualizer

Visualisez la structure de vos bases de données SQL de manière interactive et dynamique 💡  
Visualize your SQL database structure interactively and dynamically 💡

---

## 🌟 Description du Projet / Project Description

**SQL Table Visualizer** est un outil web qui permet d’importer un fichier `.sql` et d’afficher automatiquement les tables, champs dans une interface graphique intuitive.  
**SQL Table Visualizer** is a web tool that allows you to upload a `.sql` file and visualize tables, fields in a user-friendly graphical interface.

---

## 🛠️ Technologies Utilisées / Technologies Used

- **HTML5** 🧱 : Structure du projet
- **CSS3** 🎨 : Mise en forme responsive & animations
- **JavaScript Vanilla** 🧠 : Lecture SQL, rendu dynamique, zoom & déplacement

---

## 📂 Structure du Projet / Project Structure

```
sql-table-visualizer/
├── index.html           # Interface principale / Main interface
├── README.md            # Ce fichier / This file
├── src/
│   ├── index.js         # Logique principale / Main logic
│   └── css.css          # Styles du projet / Project styles
```

---

## 🚀 Fonctionnalités / Features

- 📂 **Importer un fichier SQL**  
  Importez un fichier `.sql` contenant vos structures de tables.  
  Upload any `.sql` file to visualize your database structure.

- 🗃️ **Affichage des tables sous forme de cartes**  
  Chaque table est affichée sous forme de carte avec ses champs.  
  Each table is displayed as a card with its fields.

- 🎯 **Relations visuelles (Foreign Keys)**  
  Des lignes colorées relient les tables via les clés étrangères.  
  Colorful lines represent foreign key relationships.

- 🔍 **Zoom & Déplacement**  
  CTRL + molette pour zoomer, clic maintenu pour bouger la zone.  
  CTRL + scroll to zoom, hold click to pan.

- 📐 **Grille adaptative**  
  La grille s’étend automatiquement selon le nombre de tables.  
  The grid expands dynamically depending on the number of tables.

- ➕ **Disposition horizontale si > 50 tables**  
  Si plus de 50 tables, une grille de 30 colonnes s’active.  
  If more than 50 tables, the layout switches to a 30-column grid.

- 🧠 **Menu contextuel personnalisé**  
  Clic droit sur une table pour afficher son ID ou d’autres actions futures.  
  Right-click on a table to access a custom context menu (with table ID).

- 🚫 **Menu contextuel par défaut désactivé**  
  Pour une expérience 100% personnalisée.  
  Default right-click menu is disabled for full control.

---

## 🔧 Utilisation / How to Use

1. 📁 Ouvrir le fichier `index.html` dans un navigateur
2. 📄 Importer un fichier `.sql`
3. 👀 Visualiser la base, zoomer, déplacer, explorer !

---

## 📧 Contact

Pour toute question, suggestion ou contribution :  
For any questions, suggestions or contributions:

📩 [Arms](mailto:armsgfx@gmail.com).
