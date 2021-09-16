import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PageData from './PageData.jsx';

function fetchViewableData(){
	return JSON.parse(context.viewableData);
}

// // Used for routing
var allFormattedNavLinks = [];
// Get top level nav links
var formattedNavLinks = [];
context.navLinks.forEach((link) => {
	var formattedNavLink = {};
	formattedNavLink.Title = link.Title;
	formattedNavLink.URLSegment = link.URLSegment;
	formattedNavLink.pagetype = link.ClassName;
	// Get dropdown nav links
	formattedNavLink.children = [];
	link.Children.forEach((subPage) => {
		var formattedSubPageNavLink = {};
		formattedSubPageNavLink.Title = subPage.Title;
		formattedSubPageNavLink.URLSegment = subPage.URLSegment;
		formattedSubPageNavLink.pagetype = subPage.ClassName;
		formattedNavLink.children.push(formattedSubPageNavLink);
		allFormattedNavLinks.push(formattedSubPageNavLink);
	});
	formattedNavLinks.push(formattedNavLink);
	allFormattedNavLinks.push(formattedNavLink);
});

const html = ReactDOMServer.renderToString(
	<div className="window-component">
		<div className="main-nav-menu-button">
			<i className="fas fa-bars"></i>
		</div>
		<PageData
			fetchViewableData={fetchViewableData}
			formattedNavLinks={formattedNavLinks}
			allFormattedNavLinks={allFormattedNavLinks}
			isBrowser={false}
			className={context.ClassName}
		/>
	</div>
);
dispatch(html);