!(() => {
	function generate() {
		const minPopularity = 50;

		document.getElementById('spinner').style.display = 'block';
		document.getElementById('container').style.display = 'none';
		document.getElementById('bon-retour').style.display = 'none';
		let loaded1 = false;
		let loaded2 = false;

		const year = randomIntFromInterval(1970, 2023);

		let person1human = false;
		let person2human = false;

		/* Force at least one to be human
		if (Math.random() < 0.5) {
			person1human = true;
		} else {
			person2human = true;
		}*/

		let filteredDead = [];
		let filteredBorn = [];

		filteredDead = peopleList.filter((person) => person[2] === year && person[3] >= minPopularity);
		filteredBorn = peopleList.filter((person) => person[1] === year && person[3] >= minPopularity);

		if (person1human) {
			filteredDead = filteredDead.filter((person) => person[4] === true);
		}

		if (person2human) {
			filteredBorn = filteredBorn.filter((person) => person[4] === true);
		}

		const deadIndex = Math.floor(Math.random() * filteredDead.length);
		const bornIndex = Math.floor(Math.random() * filteredBorn.length);

		// Get the selected people
		const person1 = filteredDead[deadIndex];
		const person2 = filteredBorn[bornIndex];

		// Display the information
		document.getElementById('image1').src = person1[6];
		document.getElementById('image2').src = person2[6];

		document.getElementById('bon-retour-text').textContent =
			'Bon retour parmi nous ' + person1[0].replace(' ', '\u00a0') + '\u00a0❤️';
		image1 = document.getElementById('image1');
		image2 = document.getElementById('image2');

		image1.onload = function () {
			console.log('1 loaded');
			document.getElementById('deathYear1').textContent = `Mort(e) en ${person1[2]}`;
			document.getElementById('name1').textContent = person1[0];
			loaded1 = true;
			if (loaded1 && loaded2) {
				document.getElementById('spinner').style.display = 'none';
				document.getElementById('container').style.display = 'flex';
				document.getElementById('bon-retour').style.display = 'block';
			}
		};

		image2.onload = function () {
			console.log('2 loaded');
			document.getElementById('birthYear2').textContent = `Né(e) en ${person2[1]}`;
			document.getElementById('name2').textContent = person2[0];
			loaded2 = true;
			if (loaded1 && loaded2) {
				document.getElementById('spinner').style.display = 'none';
				document.getElementById('container').style.display = 'flex';
				document.getElementById('bon-retour').style.display = 'block';
			}
		};
	}

	function randomIntFromInterval(min, max) {
		// min and max included
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	async function getList() {
		const request = await fetch('data.txt', { method: 'GET' });
		const response = await request.text();
		const result = JSON.parse(`[${response.replace(/,\s*$/, '')}]`);
		return result;
	}

	window.addEventListener('load', async () => {
		peopleList = await getList();
		generate();
		document.getElementById('generate').addEventListener('click', generate);
	});
})();
