exports.calculateAverageScore = (movie) =>{
    if(movie.ratings.length > 0){
        const average = movie.ratings.reduce((acc, c) => acc + c) / movie.ratings.length;
        movie.averageRating = Math.round(average * 10) / 10;
    }else{
        movie.averageRating = null;
    }
}

exports.removeRating = (movie, rating) =>{
    const index = movie.ratings.findIndex((movieRating) => movieRating === rating);
    movie.ratings.splice(index, 1);
}

exports.checkIfMovieIsInWatchlist = (user, movieId) =>{
    if(user.watchlist.length > 0){
        for(let i = 0; i < user.watchlist.length; i++){
            if(user.watchlist[i].toString() === movieId.toString()){
                return true;
            }
        }
        return false;
    }
}

exports.checkIfUserWatchedMovie = (user, movieId) =>{
    if(user.watched.length > 0){
        for(let i = 0; i < user.watched.length; i++){
            if(user.watched[i].movie.toString() === movieId.toString()){
                return true;
            }
        }
        return false;
    }
}