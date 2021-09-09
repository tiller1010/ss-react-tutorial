import React from 'react';
import { Link, withRouter } from 'react-router-dom';

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
	}

	componentDidMount(){
		this.loadViewableData();
		this.renderArticle();
	}

	componentDidUpdate(prevProps){
		if(prevProps.location.key !== this.props.location.key){
			this.renderArticle();
		}
	}

	async loadViewableData(){
		this.setState({
			Content: '<div class="lds-facebook"><div></div><div></div><div></div></div>'
		});
		const data = await this.props.fetchViewableData();
		if(data){
			if(data.Title){
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
				SiteConfig_SocialLinks: data.SiteConfig_SocialLinks
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

export default withRouter(BlogPage);