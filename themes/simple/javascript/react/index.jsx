import React from 'react';
import ReactDOM from 'react-dom';
import Page from './components/Page.jsx';

async function fetchViewableData(){
	try {
		const path = document.location.pathname === '/' ? `${document.location}home` : document.location;
		const response = await fetch(`${path}/fetchViewableData`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'}
		});
		const body = await response.text();
		const result = JSON.parse(body);

		return result;
	} catch(error){
		console.log(error);
	}
}

ReactDOM.render(
	<Page fetchViewableData={fetchViewableData}/>,
	document.getElementById('react-entry')
);