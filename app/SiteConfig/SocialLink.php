<?php

use SilverStripe\ORM\DataObject;
use SilverStripe\SiteConfig\SiteConfig;
use SilverStripe\Forms\Fieldlist;
use SilverStripe\Forms\TextField;

class SocialLink extends DataObject{
	private static $db = [
		'Type' => 'Text',
		'Icon' => 'Text',
		'Link' => 'Text'
	];

	private static $has_one = [
		'SiteConfig' => SiteConfig::class
	];

	private static $summary_fields = [
		'Type'
	];

	public function getCMSFields(){
		return Fieldlist::create(
			TextField::create('Type'),
			TextField::create('Link'),
			TextField::create('Icon')
				->setAttribute('placeholder', 'example: facebook')
		);
	}
}