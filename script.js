const items = [
    { year: 1970, values: 371 },
    { year: 1971, values: 647 },
    { year: 1972, values: 445 },
    { year: 1973, values: 562 },
    { year: 1974, values: 356 },
    { year: 1975, values: 313 },
    { year: 1976, values: 360 },
    { year: 1977, values: 352 },
    { year: 1978, values: 331 },
    { year: 1979, values: 396 },
    { year: 1980, values: 366 },
    { year: 1981, values: 414 },
    { year: 1982, values: 417 },
    { year: 1983, values: 367 },
    { year: 1984, values: 384 },
    { year: 1985, values: 422 },
    { year: 1986, values: 433 },
    { year: 1987, values: 433 },
    { year: 1988, values: 375 },
    { year: 1989, values: 433 },
    { year: 1990, values: 419 },
    { year: 1991, values: 420 },
    { year: 1992, values: 456 },
    { year: 1993, values: 366 },
    { year: 1994, values: 323 },
    { year: 1995, values: 300 },
    { year: 1996, values: 307 },
    { year: 1997, values: 291 },
    { year: 1998, values: 190 },
    { year: 1999, values: 271 },
    { year: 2000, values: 216 },
    { year: 2001, values: 198 },
    { year: 2002, values: 173 },
    { year: 2003, values: 178 },
    { year: 2004, values: 199 },
    { year: 2005, values: 271 },
    { year: 2006, values: 173 },
    { year: 2007, values: 150 },
    { year: 2008, values: 124 },
    { year: 2009, values: 101 },
    { year: 2010, values: 111 },
    { year: 2011, values: 86 },
    { year: 2012, values: 88 },
    { year: 2013, values: 77 },
    { year: 2014, values: 87 },
    { year: 2015, values: 80 },
    { year: 2016, values: 77 },
    { year: 2017, values: 57 },
    { year: 2018, values: 57 },
    { year: 2019, values: 84 },
    { year: 2020, values: 49 },
    { year: 2021, values: 38 },
    { year: 2022, values: 38 },
    { year: 2023, values: 23 },
    { year: null, values: 7279 },
];

const TOTAL_ITEMS = 21534;

const loadedItems = {};

const random = (max) => Math.floor(Math.random() * max);

const getRandomYear = () => {
    let randomItem = random(TOTAL_ITEMS);
    let year;

    for (const item of items) {
        if (randomItem < item.values) {
            year = item;
            break;
        }
        randomItem -= item.values;
    }
    return year;
};

const start = () => {
    document.querySelector("#generate").addEventListener("click", generate);

    generate(true);
};

const generate = async (setLoad) => {
    setLoad && toggleLoading();
    const year = getRandomYear();

    if (!loadedItems[year.year]) {
        loadedItems[year.year] = await fetch(
            `${window.location.origin}/data_by_year/${year.year}.json`
        ).then((res) => res.json());
    }

    let firstSubject = getItem(
        year.year,
        random(loadedItems[year.year].length),
        true
    );

    if (!loadedItems[firstSubject[2]]) {
        loadedItems[firstSubject[2]] = await fetch(
            `${window.location.origin}/data_by_year/${firstSubject[2]}.json`
        ).then((res) => res.json());
    }

    let secondSubject = getItem(
        firstSubject[2],
        random(loadedItems[firstSubject[2]].length)
    );

    // first subject
    document.querySelector("#first_subject_year").innerHTML = firstSubject[2];
    const img = document.querySelector("#first_subject_img img");
    img.src = firstSubject[6];
    img.alt = firstSubject[0];
    document.querySelector("#first_subject_name").innerHTML = firstSubject[0];
    document.querySelector("#first_subject").innerHTML = firstSubject[0];

    // second subject
    document.querySelector("#second_subject_year").innerHTML = secondSubject[1];
    const img2 = document.querySelector("#second_subject_img img");
    img2.src = secondSubject[6];
    img2.alt = secondSubject[0];
    document.querySelector("#second_subject_name").innerHTML = secondSubject[0];

    toggleLoading();
};

const getItem = (year, item, needSecondDate = false) => {
    console.log(year, item, needSecondDate);
    const i = loadedItems[year][item];
    if (needSecondDate && i[2] === null) {
        return getItem(year, random(loadedItems[year].length), needSecondDate);
    }

    return i;
};

const toggleLoading = () => {
    const loader = document.querySelector("#loader");
    const main = document.querySelector("#main");
    loader.classList.toggle("hidden");
    main.classList.toggle("hidden");
};

window.addEventListener("load", start);
