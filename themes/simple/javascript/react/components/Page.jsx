import React from 'react';

class Page extends React.Component {
	constructor(props){
		super(props);
		let state = {
			Title: '...',
			Content: '<p></p>',
			SiteConfig_SocialLinks: []
		}
		if(this.props.isBrowser){
			if(window.initialReactData){
				state = window.initialReactData;
				delete window.initialReactData;
			}
		}
		this.state = state;
	}

	componentWillMount(){
		this.loadViewableData();
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
				SiteConfig_SocialLinks: data.SiteConfig_SocialLinks
			});
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
			</div>
		);
	}
}

export default Page;