<?php

use SilverStripe\Forms\Tab;
use SilverStripe\Forms\TabSet;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldConfig_RecordEditor;
use SilverStripe\Forms\HTMLEditor\HTMLEditorField;

class BlogPage extends Page {

	private static $has_many = [
		'Articles' => ArticleObject::class
	];

	public function getCMSFields()
	{
		$fields = parent::getCMSFields();
		$fields->insertAfter(
			new Tab(
				'Articles',
				GridField::create(
					'Articles',
					'Articles',
					$this->Articles(),
					GridfieldConfig_RecordEditor::create()
				)
			),
			'Content'
		);
		return $fields;
	}
}