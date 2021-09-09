import React from 'react';
import ReactDOM from 'react-dom';
import Page from './components/Page.jsx';
import BlogPage from './components/BlogPage.jsx';
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
	constructor(props){
		super(props);
		this.state = {
			opened: false
		}
		this.toggleNav = this.toggleNav.bind(this);
	}

	toggleNav(){
		if(window.innerWidth < 815){
			this.setState(prevState => ({
				opened: !prevState.opened
			}));
		}
	}

	componentDidMount(){
		const context = this;
		window.addEventListener('resize', function(){
			if(window.innerWidth > 815){
				context.setState({
					opened: false
				});
			}
		});
	}

	renderSwitch(pagetype){
		switch(pagetype){
			case 'Page':
				return <Page fetchViewableData={fetchViewableData}/>
			case 'BlogPage':
				return <BlogPage fetchViewableData={fetchViewableData}/>
			break;
		}
	}

	render(){
		// Used for routing
		var allFormattedNavLinks = [];
		// Get top level nav links
		var navLinks = Array.from(document.querySelectorAll('header nav.primary > ul > li > a'));
		var formattedNavLinks = [];
		navLinks.forEach((link) => {
			var formattedNavLink = {};
			formattedNavLink.Title = link.innerText;
			var urlSegment = link.href.split('/').reverse()[1] !== document.domain ? '/' + link.href.split('/').reverse()[1] : '/home';
			formattedNavLink.URLSegment = urlSegment;
			formattedNavLink.pagetype = link.attributes.pagetype.value;
			// Get dropdown nav links
			formattedNavLink.children = [];
			var subPages = Array.from(link.parentElement.querySelectorAll('ul.nav-dropdown li a'));
			subPages.forEach((subPage) => {
				var formattedSubPageNavLink = {};
				formattedSubPageNavLink.Title = subPage.innerText;
				var subPageUrlSegment = subPage.href.replace(document.location.origin, '');
				formattedSubPageNavLink.URLSegment = subPageUrlSegment;
				formattedSubPageNavLink.pagetype = subPage.attributes.pagetype.value;
				formattedNavLink.children.push(formattedSubPageNavLink);
				allFormattedNavLinks.push(formattedSubPageNavLink);
			});
			formattedNavLinks.push(formattedNavLink);
			allFormattedNavLinks.push(formattedNavLink);
		});

		var style;
		if(this.state.opened){
			style ={
				transform: 'translateX(-200px)'
			}
		} else {
			style ={
				transform: 'translateX(0)'
			}
		}

		return (
			<div style={style} className="window-component">
				<div className="main-nav-menu-button" onClick={this.toggleNav}>
					<i className="fas fa-bars"></i>
				</div>
				<div className="nav">
					<ul className="main-nav-list">
						{formattedNavLinks.map((link) => (
							<li key={formattedNavLinks.indexOf(link)} className="main-nav-list-item" onClick={this.toggleNav}>
								<Link to={link.URLSegment}>
									{link.Title}
								</Link>
								{link.children.length ?
									<ul className="main-nav-dropdown">
										{link.children.map((subPageLink) => (
											<li key={link.children.indexOf(subPageLink)}>
												<Link to={subPageLink.URLSegment}>
													{subPageLink.Title}
												</Link>
											</li>
										))}
									</ul>
									:
									''
								}
							</li>
						))}
					</ul>
				</div>
				<Switch>
					<Route exact path="/">
						<Page fetchViewableData={fetchViewableData}/>
					</Route>
					{allFormattedNavLinks.map((link) => (
						<Route key={allFormattedNavLinks.indexOf(link)} path={link.URLSegment}>
							{this.renderSwitch(link.pagetype)}
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