db = db.getSiblingDB('sample_mflix')

const reqLength = 5
var counter = 1;

collection = db.movies;
var movies = collection.find();
  movies.forEach(movie => {
      print("Processing: " + counter)
    collection.updateOne({"_id":movie._id},{"$set":{
        "asciiTitle":convertToASCII(movie.title)
    }})
    counter++
  })

function convertToASCII(normalText){
    resultText = "";

    //ascii conversion
    for(var i = 0; i < normalText.length; i++){
        if(i < reqLength){
            resultText += normalText.charCodeAt(i);
        }
    }

    //fix short strings
    for(var i = 0; i < (reqLength - normalText.length); i++){
        resultText += "00"
    }

    return parseInt(resultText)
    
}

