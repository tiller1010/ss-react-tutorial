<?php

use DNADesign\Elemental\Extensions\ElementalPageExtension;
use SilverStripe\Security\Member;
use SilverStripe\Security\PasswordValidator;
use SilverStripe\SiteConfig\SiteConfig;

// remove PasswordValidator for SilverStripe 5.0
$validator = PasswordValidator::create();
// Settings are registered via Injector configuration - see passwords.yml in framework
Member::set_password_validator($validator);
SiteConfig::add_extension(SiteConfigExtension::class);

Page::add_extension(ElementalPageExtension::class);