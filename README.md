# About
Highschool graduation project - a full-stack web application using the MEVN stack (MongoDB, Express.js, Vue.js, Node.js). 
Some things may not work, such as the scraping scripts, because the source websites' HTML may have changed since 2022.

## Features
- The web service endlessly scrapes some of the most popular Slovenian news websites, and saves information of all new articles to its own MongoDB database. 
- The website allows users to browse articles from all of these sources in one place, or filter some of the sources out.
- You can select an article and view a more detailed summary, as well as ratings and comments. The view page includes a link to the original article, where you can read it in full.
- Users can sign up and log in - authentication is done via JWT and local storage. Users can like/dislike articles, post and like/dislike comments as well as replies to comments.
- A basic admin panel is for users with administrator privileges

## Preview images

All styles are hand-made with tailwindCSS and responsive to screens of various sizes.

- The view article page on a PC
![image](https://github.com/tadejrebernjak/matura/assets/89967862/52ee62c1-ce16-433e-bd1f-633696c7f52f)

- Comments and replies
![image](https://github.com/tadejrebernjak/matura/assets/89967862/0199779a-78de-4835-b684-f77bdc07c607)

- Part of the admin panel (blocking a user from commenting)
![image](https://github.com/tadejrebernjak/matura/assets/89967862/0c634d6a-f774-4a44-9213-eaa047dfd8a2)

- Home page on a mobile phone
![image](https://github.com/tadejrebernjak/matura/assets/89967862/f77d20d5-56b6-4c12-bf80-8d741b12ec72)
