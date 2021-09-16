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

    public function feedViewableData()
    {
        $viewableData = [
            'Title' => $this->Title,
            'Content' => $this->Content,
            'URLSegment' => $this->URLSegment,
            'Articles' => $this->Articles()->toNestedArray(),
            'SiteConfig_SocialLinks' => $this->SiteConfig->SocialLinks()->toNestedArray()
        ];
        if($this->getArticleHTML()){
            $viewableData['DefaultArticleMarkup'] = $this->getArticleHTML()->Raw();
        }
        return json_encode($viewableData);
    }

    public function renderArticle()
    {
    	if($this->getRequest()->isAjax()){
    		return $this->getArticleHTML();
    	} else {
    		return $this->index($this->request);
    	}
    }

    public function getArticleHTML()
    {
        $articleURL = $this->getRequest()->param('articleURL');
        $article = ArticleObject::get()->filter([
            'URLSegment' => $articleURL,
            'BlogPageID' => $this->ID
        ])->first();
        if($article){
            return $article->renderWith('Layout/Article');
        } else {
            return null;
        }
    }
}