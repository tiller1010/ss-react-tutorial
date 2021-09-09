<?php

use SilverStripe\ORM\DataObject;
use SilverStripe\Assets\Image;
use SilverStripe\Forms\Fieldlist;
use SilverStripe\Forms\TextField;
use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\Forms\HTMLEditor\HTMLEditorField;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\CMS\Model\SiteTree;

class ArticleObject extends DataObject {

	private static $db = [
		'Title' => 'Text',
		'URLSegment' => 'Text',
		'Content' => 'HTMLText',
		'ImageURL' => 'Text'
	];

	private static $has_one = [
		'BlogPage' => BlogPage::class,
		'Image' => Image::class
	];

	private static $owns = [
		'Image'
	];

	public function getCMSFields()
	{
		$imageField = UploadField::create('Image');
		$imageField->setFolderName('ArticleImages');
		$imageField->getValidator()->setAllowedExtensions(['jpg', 'jpeg', 'png']);
		return Fieldlist::create(
			TextField::create('Title'),
			$imageField,
			HTMLEditorField::create('Content')
		);
	}

	public function onBeforeWrite()
	{
		parent::onBeforeWrite();
		$this->URLSegment = Injector::inst()->get(SiteTree::class)->generateURLSegment($this->Title);
		$this->ImageURL = $this->Image->URL;
	}
}