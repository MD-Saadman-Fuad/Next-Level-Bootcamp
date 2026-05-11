interface Developer<T, X=null> {
  name: string;
  programmingLanguage: string;
  salary: number;
  device: {
    brand: string;
    model: string;
    releaseYear: number;
  };
  smartWatch: T;
  bike?: X,
}


const poorDeveloper : Developer<{ brand: string; model: string; releaseYear: number }, { brand: string; model: string; releaseYear: number }>= {
    name: "John Doe",
    programmingLanguage: "JavaScript",
    salary: 50000,
    device: {
        brand: "Dell",
        model: "XPS 13",
        releaseYear: 2020,
    },
    smartWatch: {
        brand: "Apple",
        model: "Apple Watch",
        releaseYear: 2021
    }
}
const richDeveloper : Developer<{ brand: string; model: string; releaseYear: number; callFeature: boolean }, { brand: string; model: string; releaseYear: number } >= {
    name: " Jane Smith",
    programmingLanguage: "JavaScript",
    salary: 150000,
    device: {
        brand: "MacBook Pro",
        model: "XPS 13",
        releaseYear: 2020,
    },
    smartWatch: {
        brand: "Apple",
        model: "Apple Watch",
        releaseYear: 2021,
        callFeature: true,
    }
}