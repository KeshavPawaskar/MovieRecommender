const movies = [
  {
    id: "the-prestige",
    title: "The Prestige",
    year: 2006,
    genres: ["Drama", "Mystery", "Sci-Fi"],
    runtime: 130,
    imdb: 8.5,
    rottenTomatoes: "77%",
    director: "Christopher Nolan",
    actors: ["Christian Bale", "Hugh Jackman", "Rebecca Hall"],
    summary: "Two stage magicians turn rivalry into obsession while chasing the perfect illusion. A smart, twisty drama with emotional stakes and careful reveals.",
    poster: "https://image.tmdb.org/t/p/w780/Ag2B2KHKQPukjH7WutmgnnSNurZ.jpg",
    providers: {
      IN: ["Prime Video", "Apple TV"],
      US: ["Prime Video", "Apple TV"],
      GB: ["Apple TV"]
    }
  },
  {
    id: "zodiac",
    title: "Zodiac",
    year: 2007,
    genres: ["Crime", "Drama", "Mystery", "Thriller"],
    runtime: 157,
    imdb: 7.7,
    rottenTomatoes: "90%",
    director: "David Fincher",
    actors: ["Jake Gyllenhaal", "Mark Ruffalo", "Robert Downey Jr."],
    summary: "Reporters and detectives become consumed by a serial-killer investigation across years. It is tense, patient, and driven by obsession rather than jump scares.",
    poster: "https://image.tmdb.org/t/p/w780/6YmeO4pB7XTh8P8F960O1uA14JO.jpg",
    providers: {
      IN: ["Netflix", "Apple TV"],
      US: ["Netflix", "Apple TV"],
      GB: ["Netflix"]
    }
  },
  {
    id: "arrival",
    title: "Arrival",
    year: 2016,
    genres: ["Drama", "Mystery", "Sci-Fi"],
    runtime: 116,
    imdb: 7.9,
    rottenTomatoes: "94%",
    director: "Denis Villeneuve",
    actors: ["Amy Adams", "Jeremy Renner", "Forest Whitaker"],
    summary: "A linguist helps decode an alien language after mysterious ships appear worldwide. It is thoughtful science fiction with a deeply human center.",
    poster: "https://image.tmdb.org/t/p/w780/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    providers: {
      IN: ["Prime Video", "Apple TV"],
      US: ["Paramount+", "Apple TV"],
      GB: ["Prime Video", "Apple TV"]
    }
  },
  {
    id: "knives-out",
    title: "Knives Out",
    year: 2019,
    genres: ["Comedy", "Crime", "Mystery"],
    runtime: 131,
    imdb: 7.9,
    rottenTomatoes: "97%",
    director: "Rian Johnson",
    actors: ["Daniel Craig", "Ana de Armas", "Chris Evans"],
    summary: "A detective investigates a wealthy family's tangled stories after a suspicious death. It is playful, sharp, and easy to enjoy with a group.",
    poster: "https://image.tmdb.org/t/p/w780/pThyQovXQrw2m0s9x82twj48Jq4.jpg",
    providers: {
      IN: ["Netflix", "Apple TV"],
      US: ["Netflix", "Apple TV"],
      GB: ["Prime Video", "Apple TV"]
    }
  },
  {
    id: "the-lunchbox",
    title: "The Lunchbox",
    year: 2013,
    genres: ["Drama", "Romance"],
    runtime: 104,
    imdb: 7.8,
    rottenTomatoes: "97%",
    director: "Ritesh Batra",
    actors: ["Irrfan Khan", "Nimrat Kaur", "Nawazuddin Siddiqui"],
    summary: "A mistaken lunch delivery creates an unexpected connection between two lonely people. It is gentle, warm, and quietly moving.",
    poster: "https://image.tmdb.org/t/p/w780/jSOiz1h97i3qwjZJXY8SeLvjPsl.jpg",
    providers: {
      IN: ["Netflix", "Prime Video"],
      US: ["Prime Video", "Apple TV"],
      GB: ["Prime Video"]
    }
  },
  {
    id: "andhadhun",
    title: "Andhadhun",
    year: 2018,
    genres: ["Crime", "Comedy", "Thriller"],
    runtime: 139,
    imdb: 8.2,
    rottenTomatoes: "100%",
    director: "Sriram Raghavan",
    actors: ["Ayushmann Khurrana", "Tabu", "Radhika Apte"],
    summary: "A pianist's life spirals after he is pulled into a crime he should not have witnessed. It is darkly funny, unpredictable, and tightly paced.",
    poster: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/Andhadhun_poster.jpg/250px-Andhadhun_poster.jpg",
    providers: {
      IN: ["Netflix", "JioCinema"],
      US: ["Netflix"],
      GB: ["Netflix"]
    }
  },
  {
    id: "spider-verse",
    title: "Spider-Man: Into the Spider-Verse",
    year: 2018,
    genres: ["Animation", "Comedy", "Sci-Fi"],
    runtime: 117,
    imdb: 8.4,
    rottenTomatoes: "97%",
    director: "Bob Persichetti, Peter Ramsey, Rodney Rothman",
    actors: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"],
    summary: "A teenager discovers a bigger multiverse of heroes while learning what makes him unique. It is energetic, heartfelt, and visually inventive.",
    poster: "https://image.tmdb.org/t/p/w780/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
    providers: {
      IN: ["Netflix", "Apple TV"],
      US: ["Netflix", "Disney+", "Apple TV"],
      GB: ["Netflix", "Prime Video"]
    }
  },
  {
    id: "drishyam",
    title: "Drishyam",
    year: 2015,
    genres: ["Crime", "Drama", "Thriller"],
    runtime: 163,
    imdb: 8.2,
    rottenTomatoes: "80%",
    director: "Nishikant Kamat",
    actors: ["Ajay Devgn", "Tabu", "Shriya Saran"],
    summary: "A devoted father builds a careful defense when his family is threatened. It is a gripping thriller powered by planning, pressure, and moral tension.",
    poster: "https://image.tmdb.org/t/p/w780/gIClWRv5OSe8rl5Koi0AeUcCZ9Z.jpg",
    providers: {
      IN: ["Netflix", "Disney+ Hotstar"],
      US: ["Netflix"],
      GB: ["Netflix"]
    }
  },
  {
    id: "chef",
    title: "Chef",
    year: 2014,
    genres: ["Comedy", "Drama"],
    runtime: 114,
    imdb: 7.3,
    rottenTomatoes: "87%",
    director: "Jon Favreau",
    actors: ["Jon Favreau", "Sofia Vergara", "John Leguizamo"],
    summary: "A chef rebuilds his creative life through a food truck and a cross-country trip. It is relaxed, funny, and ideal for a low-stress weekend watch.",
    poster: "https://image.tmdb.org/t/p/w780/hyp8EXDmO4dSC8V6Q5jU7gD1kcg.jpg",
    providers: {
      IN: ["Prime Video", "Apple TV"],
      US: ["Prime Video", "Apple TV"],
      GB: ["Prime Video"]
    }
  },
  {
    id: "mad-max-fury-road",
    title: "Mad Max: Fury Road",
    year: 2015,
    genres: ["Sci-Fi", "Thriller"],
    runtime: 121,
    imdb: 8.1,
    rottenTomatoes: "97%",
    director: "George Miller",
    actors: ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"],
    summary: "A road warrior and a rebel driver fight across a desert wasteland. It is propulsive, cinematic, and built for a high-energy movie night.",
    poster: "https://image.tmdb.org/t/p/w780/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
    providers: {
      IN: ["Prime Video", "Apple TV"],
      US: ["Max", "Apple TV"],
      GB: ["Prime Video", "Apple TV"]
    }
  }
];

module.exports = { movies };
