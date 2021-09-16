import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import Page from './components/Page.jsx';
import BlogPage from './components/BlogPage.jsx';
import { Route, Router, Switch } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const BlogPageWithRouter = withRouter(BlogPage);

export default class PageData extends React.Component {

	renderSwitch(pagetype){
		switch(pagetype){
			case 'Page':
				return <Page fetchViewableData={this.props.fetchViewableData} isBrowser={this.props.isBrowser}/>
			case 'BlogPage':
				if(this.props.isBrowser){
					return <BlogPageWithRouter fetchViewableData={this.props.fetchViewableData} isBrowser={this.props.isBrowser}/>
				}
				return <BlogPage fetchViewableData={this.props.fetchViewableData} isBrowser={this.props.isBrowser}/>
			break;
		}
	}

	renderLink(link){
		if(this.props.isBrowser){
			return(
				<Link to={link.URLSegment}>
					{link.Title}
				</Link>
			);
		} else {
			return(
				<a href={link.URLSegment}>
					{link.Title}
				</a>
			);
		}
	}

	render(){

		const {
			formattedNavLinks,
			allFormattedNavLinks,
			isBrowser
		} = this.props;

		return (
			<>
				<div className="nav">
					<ul className="main-nav-list">
						{formattedNavLinks.map((link) => (
							<li key={formattedNavLinks.indexOf(link)} className="main-nav-list-item" onClick={this.props.toggleNav}>
								{this.renderLink(link)}
								{link.children.length ?
									<ul className="main-nav-dropdown">
										{link.children.map((subPageLink) => (
											<li key={link.children.indexOf(subPageLink)}>
												{this.renderLink(subPageLink)}
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
				{isBrowser ?
					<Switch>
						<Route exact path="/">
							<Page fetchViewableData={this.props.fetchViewableData} isBrowser={this.props.isBrowser}/>
						</Route>
						{allFormattedNavLinks.map((link) => (
							<Route key={allFormattedNavLinks.indexOf(link)} path={link.URLSegment}>
								{this.renderSwitch(link.pagetype)}
							</Route>
						))}
					</Switch>
					:
					this.renderSwitch(this.props.className)
				}
			</>
		);
	}
}