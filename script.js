document.addEventListener('DOMContentLoaded', () => {
	// Populate the language dropdown
	populateSelectOptions('languageSelect', 'https://api.github.com/languages');
});

async function populateSelectOptions(selectId, apiUrl) {
	const select = document.getElementById(selectId);

	//! Uncomment to limit to specific languages:
	// const allowedLanguages = ['HTML', 'CSS', 'Java', 'JavaScript', 'React', 'Ruby', 'PHP', 'Python'];

	try {
		const response = await fetch(apiUrl);
		const data = await response.json();

		if (Array.isArray(data)) {
			data.forEach(item => {

				//! Uncomment to limit to specific languages:
				// if (allowedLanguages.includes(item.name)) {

				const option = document.createElement('option');
				option.value = item.name;
				option.text = item.name;
				select.add(option);

				//! Uncomment: 
				//}

			});
		} else {
			console.error('Data is not an array:', data);
		}
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}

function exploreRepos() {
	const languageSelect = document.getElementById('languageSelect');
	const keywordSearch = document.getElementById('keywordSearch');

	const language = languageSelect.value;
	const keyword = keywordSearch.value.trim();

	// Use GitHub API to explore repositories based on language and keyword
	const apiUrl = `https://api.github.com/search/repositories?q=language:${language}+${keyword}&sort=stars&order=desc`;

	fetch(apiUrl)
		.then(response => response.json())
		.then(data => displayRepositories(data.items))
		.catch(error => console.error('Error fetching repositories:', error));
}


function displayRepositories(repositories) {
	const repoListContainer = document.getElementById('repoList');
	// Clear previous results
	repoListContainer.innerHTML = '';

	if (repositories.length === 0) {
		repoListContainer.innerHTML = '<p>No repositories found.</p>';
	} else {
		const top20Repos = repositories.slice(0, 20); // Limit to the top 20 repositories

		top20Repos.forEach((repo, index) => {
			if (index % 2 === 0) {
				// Create a new row for every even index
				const row = document.createElement('div');
				row.classList.add('row', 'mt-4');
				repoListContainer.appendChild(row);
			}

			// Create HTML elements to display repository information
			const repoCard = document.createElement('div');
			repoCard.classList.add('card', 'col-md-6');

			const starsText = formatCount(repo.stargazers_count, 'star');
			const watchersText = formatCount(repo.watchers_count, 'eye');
			const forksText = formatCount(repo.forks_count, 'code-branch');
			const deployedLink = repo.homepage ? `<p class="card-text"><strong>Deployed Project:</strong> <a href="${repo.homepage}" target="_blank">${repo.homepage}</a></p>` : '';

			repoCard.innerHTML = `
							<div class="card-body">
									<h5 class="card-title">${repo.name}</h5>
									<p class="card-text">${repo.description || 'No description available.'}</p>
									<p class="card-text">
											${starsText}
											${watchersText}
											${forksText}
									</p>
									${deployedLink}
									<a href="${repo.html_url}" target="_blank" class="btn btn-secondary">View on GitHub</a>
							</div>
					`;

			// Append the repoCard to the last row
			const lastRow = repoListContainer.lastChild;
			lastRow.appendChild(repoCard);
		});
	}
}


function formatCount(count, icon) {
	const formattedCount = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;
	return `<i class="fas fa-${icon}"></i> ${formattedCount}`;
}