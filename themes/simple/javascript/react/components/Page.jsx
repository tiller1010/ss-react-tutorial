import React from 'react';

class Page extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			Content: '<p></p>',
			SiteConfig_SocialLinks: []
		}
	}

	componentDidMount(){
		this.loadViewableData();
	}

	async loadViewableData(){
		const data = await this.props.fetchViewableData();
		if(data){
			let parsedContent = '<p></p>';
			if(data.Content){
				parsedContent = data.Content.replace(/\[image(.*)\]/, '<img $1 />');
			}
			this.setState({
				Content: parsedContent,
				SiteConfig_SocialLinks: data.SiteConfig_SocialLinks
			});
		}
	}

	render(){
		return(
			<div>
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