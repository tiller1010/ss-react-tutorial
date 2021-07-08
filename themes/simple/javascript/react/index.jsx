import React from 'react';
import ReactDOM from 'react-dom';
import Page from './components/Page.jsx';
import { Route, Router, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';

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

class Window extends React.Component {
	render(){
		var navLinks = Array.from(document.querySelectorAll('header nav.primary > ul > li > a'));
		var formattedNavLinks = [];
		navLinks.forEach((link) => {
			var formattedNavLink = {};
			formattedNavLink.Title = link.innerText;
			var urlSegment = link.href.split('/').reverse()[1] !== document.domain ? '/' + link.href.split('/').reverse()[1] : '/home';
			formattedNavLink.URLSegment = urlSegment;
			formattedNavLink.pagetype = link.attributes.pagetype.value;
			formattedNavLinks.push(formattedNavLink);
		});

		return (
			<div className="window-component">
				<div className="nav">
					<ul className="main-nav-list">
						{formattedNavLinks.map((link) => (
							<li key={formattedNavLinks.indexOf(link)} className="main-nav-list-item">
								<Link to={link.URLSegment}>
									{link.Title}
								</Link>
							</li>
						))}
					</ul>
				</div>
				<Switch>
					<Route exact path="/">
						<Page fetchViewableData={fetchViewableData}/>
					</Route>
					{formattedNavLinks.map((link) => (
						<Route key={formattedNavLinks.indexOf(link)} path={link.URLSegment}>
							<Page fetchViewableData={fetchViewableData}/>
						</Route>
					))}
				</Switch>
			</div>
		);
	}
}

const history = createBrowserHistory();

ReactDOM.render(
	<Router history={history}>
		<Window/>
	</Router>,
	document.getElementById('react-entry')
);