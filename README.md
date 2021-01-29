# Sorting text fields in Atlas Search
As of the time of this writing, it is not possible to use the <code>near</code> operator to sort text in Atlas Search. However, we are able to sort numbers. This is a guide to converting a string that needs to be sorted into its numeric (ASCII) form so that it can be sorted with Atlas Search.

## Setup
To run this example, just create an M10 or better cluster in MonogDB Atlas and load the sample dataset. Then, create an Atlas Search index on sample_mflix.movies - just go with all the default options.

## Converting Strings to ASCII
The file <code>toAscii.js</code> contains an example script to modify the <code>movies</code> collection in the <code>sample_mflix</code> (one of the default sample databases available with MongoDB Atlas) to create a field called <code>asciiTitle</code> in each record. This field will contain the ASCII value of each title. So, for example, The Sandlot would become 1161041013211597110100108111116.

In order to prevent the sort from just favoring the shortest string, we need to set a uniform length. In this example, we truncate each title to 5 characters. For movies with a title that is less than 5 characters, we'll add "00" (the ASCII value for null) to the title until it is five characters long.

We now have an integer field that will sort in (generally) the same order as the title field.

Run this script in the Mongo Shell like this:


<code>mongo "mongodb+srv://YourAtlasUri..." --username YourUserName --password YourPassword toAscii.js</code>

## Sorting in $search
Next, to sort the data in $search we can use the near operator. This can be used in conjunction with the <code>compound</code> operator to both search and sort.

This is probably easier to read in the <code>query.json</code> file.<br><br>
<code>
[
    {
      "$search": {
        "index": "default", 
        "near": {
          "path": "asciiTitle", 
          "origin": 0, 
          "pivot": 1
        }
      }
    }
  ]
</code>

The idea here is that we can sort in ascending order by finding the asciiTitle closest to zero. To sort in descending order, we can find which asciiTitle is closest to 999999999999999. This can be any number guaranteed to be higher than the highest ascii value in the dataset.

<br>
<code>
[
    {
      "$search": {
        "index": "default", 
        "near": {
          "path": "asciiTitle", 
          "origin": 999999999999999, 
          "pivot": 1
        }
      }
    }
  ]
</code>