<?php

use SilverStripe\ORM\DataExtension;
use SilverStripe\Assets\Image;
use SilverStripe\Forms\Fieldlist;
use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\Forms\TextField;
use SilverStripe\Forms\Gridfield\Gridfield;
use SilverStripe\Forms\Gridfield\GridfieldConfig_RecordEditor;

class SiteConfigExtension extends DataExtension {
	private static $has_many = [
		'SocialLinks' => SocialLink::class
	];
	public function updateCMSFields(Fieldlist $fields)
	{
		$fields->addFieldToTab('Root.Social', Gridfield::create(
			'SocialLinks',
			'Social Links',
			$this->owner->SocialLinks(),
			GridfieldConfig_RecordEditor::create()
		));
	}
}