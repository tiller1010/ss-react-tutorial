<?php

use SilverStripe\Control\HTTPRequest;

class BlogPageController extends PageController
{
    private static $allowed_actions = [
        'feedViewableData',
        'renderArticle'
    ];

    private static $url_handlers = [
        'articles/$articleURL/fetchViewableData' => 'feedViewableData',
        'articles/$articleURL' => 'renderArticle'
    ];

    public function feedViewableData(HTTPRequest $request)
    {
        $viewableData = [
            'Title' => $this->Title,
            'Content' => $this->Content,
            'URLSegment' => $this->URLSegment,
            'Articles' => $this->Articles()->toNestedArray(),
            'SiteConfig_SocialLinks' => $this->SiteConfig->SocialLinks()->toNestedArray()
        ];
        return json_encode($viewableData);
    }

    public function renderArticle()
    {
    	if($this->getRequest()->isAjax()){
    		$articleURL = $this->getRequest()->param('articleURL');
    		$article = ArticleObject::get()->filter(['URLSegment' => $articleURL])->first();
    		if($article->exists()){
    			return $article->renderWith('Layout/Article');
    		} else {
    			return $this;
    		}
    	} else {
    		return $this;
    	}
    }
}