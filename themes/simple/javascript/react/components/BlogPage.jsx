import React from 'react';
import { Link } from 'react-router-dom';

class BlogPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			Title: '...',
			Content: '<p></p>',
			URLSegment: '',
			ArticleMarkup: '<p></p>',
			Articles: [],
			SiteConfig_SocialLinks: []
		}
		this.renderArticle = this.renderArticle.bind(this);
		this.renderArticleLink = this.renderArticleLink.bind(this);
	}

	componentWillMount(){
		this.loadViewableData();
		if(this.props.isBrowser){
			this.renderArticle();
		}
	}

	componentDidUpdate(prevProps){
		if(this.props.isBrowser){
			if(prevProps.location){
				if(prevProps.location.key !== this.props.location.key){
					this.renderArticle();
				}
			}
		}
	}

	async loadViewableData(){
		let data = {};
		if(this.props.isBrowser){
			this.setState({
				Content: '<div class="lds-facebook"><div></div><div></div><div></div></div>'
			});
			data = await this.props.fetchViewableData();
		} else {
			data = this.props.fetchViewableData();
		}
		if(data){
			if(data.Title && this.props.isBrowser){
				document.querySelector('title').innerHTML = data.Title;
			}
			let parsedContent = '<p></p>';
			if(data.Content){
				parsedContent = data.Content.replace(/\[image(.*)\]/, '<img $1 />');
			}
			this.setState({
				Title: data.Title,
				Content: parsedContent,
				URLSegment: data.URLSegment,
				Articles: data.Articles,
				SiteConfig_SocialLinks: data.SiteConfig_SocialLinks,
				ArticleMarkup: data.DefaultArticleMarkup ? data.DefaultArticleMarkup : '<p></p>'
			});
		}
	}

	async renderArticle(){
		if(/\/articles\/\w+/.test(document.location)){
			this.setState({
				ArticleMarkup: '<div class="lds-facebook"><div></div><div></div><div></div></div>'
			});
			await fetch(document.location, {headers: {'x-requested-with': 'XMLHttpRequest'}})
				.then(response => response.text())
				.then(response => this.setState({ArticleMarkup: response}));
		} else {
			this.setState({ArticleMarkup: '<p></p>'});
		}
	}

	renderArticleLink(article){
		if(this.props.isBrowser){
			return(
				<Link to={`/${this.state.URLSegment}/articles/${article.URLSegment}`}>
					<p>{article.Title}</p>
					<div className="img-container">
						{article.ImageURL ?
							<img src={article.ImageURL} alt={`${article.Title} image`}/>
							:
							''
						}
					</div>
				</Link>
			);
		} else {
			return(
				<a href={`/${this.state.URLSegment}/articles/${article.URLSegment}`}>
					<p>{article.Title}</p>
					<div className="img-container">
						{article.ImageURL ?
							<img src={article.ImageURL} alt={`${article.Title} image`}/>
							:
							''
						}
					</div>
				</a>
			);
		}
	}

	render(){
		return(
			<div className="inner typography line">
				<h1>{this.state.Title}</h1>
				<div dangerouslySetInnerHTML={{__html: this.state.Content}}></div>
				{this.state.SiteConfig_SocialLinks ?
					<ul className="social-banner">
						{this.state.SiteConfig_SocialLinks.map((socialLink) =>
							<li key={this.state.SiteConfig_SocialLinks.indexOf(socialLink)}>
								<a href={socialLink.Link}>
									<i className={`fab fa-${socialLink.Icon}`}></i>
									{socialLink.Type}
								</a>
							</li>
						)}
					</ul>
					:
					''
				}
				<div dangerouslySetInnerHTML={{__html: this.state.ArticleMarkup}}></div>
				{this.state.Articles ?
					<div>
						<h2>Latest Articles</h2>
						<ul className='blog-listing'>
							{this.state.Articles.map((article) => 
								<li key={this.state.Articles.indexOf(article)}>
									{this.renderArticleLink(article)}
								</li>
							)}
						</ul>
					</div>
					:
					''
				}
			</div>
		);
	}
}

export default BlogPage;