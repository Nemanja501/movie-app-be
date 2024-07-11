Back end of my movie app, built in NodeJs with the ExpressJs framework with a database in MongoDB

Features: 
- All users can view every movie, review, actor and director
- Handled authentication by generating jwt tokens every time a user logs in and sending them to the front end
- Handled password encryption by using the "bcrypt" package
- Handled image upload by using the "multer" package. Images will be stored here in the "images" folder
- Logged in users can add movies to their "watchlist" and "watched" array, as well as remove them
- Logged in users can also add ratings to films. Ratings will be stored in the "watched" array next to the id of the movie
- Ratings are sent to the "ratings" array of the film, which is used to calculate the average score of the film
- Logged in users can also post their reviews to movies
- If the user has already rated the film, then the stars in the "Add Review" popup on the front end will automitically be filled acording to the rating the user gave the film
- When posting the review, if the user chooses a rating that is different than the one they initially gave it, the old rating will be replaced with the one the user gave it in the review
- Removing the movie from the "Watched Movies" page on the front end will also remove the rating from the "ratings" array of the film, as well as delete every review the user posted for that movie
- The user can delete their own reviews
- The user model has a "isAdmin" property, which is set to "false" by default and can only be set to true through MongoDB. This is done for security reasons so the user can't change that value from the front end.

Admin Features:
- The admin can add, edit and delete movies, actors and directors
- Can upload images when adding or editing movies
- On the "Add Movie" page all actors and directors will be fetched so the select tags can be filled with them
- Can add one director and multiple actors per film
- Deleting a movie will delete its poster from the server and it will remove that movie from every watchlist and watched movies array of every user who had it in there, it will also delete every review that movie had and it will remove that film from every director who directed it and every actor who starred in it
- Deleting a director will delete their image from the server and also delete every movie they directed, and for every movie deleted the above will happen
- Deleting an actor will delete their image from the server and remove them from every movie they starred in
- When editing a movie, director or actor, if the admin does not provide a new image the old one will be used. If the admin does provide a new image, the new one will be used and the old one will be deleted from the server