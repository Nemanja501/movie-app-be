exports.calculateAverageScore = (movie) =>{
    if(movie.ratings.length > 0){
        const average = movie.ratings.reduce((acc, c) => acc + c) / movie.ratings.length;
        movie.averageRating = Math.round(average * 10) / 10;
    }
}

exports.removeRating = (movie, rating) =>{
    const index = movie.ratings.findIndex((movieRating) => movieRating === rating);
    movie.ratings.splice(index, 1);
}