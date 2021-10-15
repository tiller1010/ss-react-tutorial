import React from 'react';

class Page extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			Title: '...',
			Content: '<p></p>',
			SiteConfig_SocialLinks: []
		}
	}

	componentDidMount(){
		this.loadViewableData();
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
				ElementalArea: data.ElementalArea,
				SiteConfig_SocialLinks: data.SiteConfig_SocialLinks
			});
		}
	}

	render(){
		return(
			<div className="inner typography line">
				<h1>{this.state.Title}</h1>
				<div dangerouslySetInnerHTML={{__html: this.state.Content}}></div>
				<div dangerouslySetInnerHTML={{__html: this.state.ElementalArea}}></div>
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