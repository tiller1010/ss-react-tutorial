<?php

namespace {

    use SilverStripe\CMS\Controllers\ContentController;
    use SilverStripe\Control\HTTPRequest;
    use SilverStripe\View\ThemeResourceLoader;
    use Spatie\Ssr\Renderer;
    use Spatie\Ssr\Engines\Node;
    use SilverStripe\Core\Environment;
    use SilverStripe\View\Requirements;

    class PageController extends ContentController
    {
        /**
         * An array of actions that can be accessed via a request. Each array element should be an action name, and the
         * permissions or conditions required to allow the user to access it.
         *
         * <code>
         * [
         *     'action', // anyone can access this action
         *     'action' => true, // same as above
         *     'action' => 'ADMIN', // you must have ADMIN permissions to access this action
         *     'action' => '->checkAction' // you can only access this action if $this->checkAction() returns true
         * ];
         * </code>
         *
         * @var array
         */
        private static $allowed_actions = [
            'feedViewableData'
        ];

        private static $url_handlers = [
            'fetchViewableData' => 'feedViewableData'
        ];

        protected function init()
        {
            parent::init();
            // You can include any CSS or JS required by your project here.
            // See: https://docs.silverstripe.org/en/developer_guides/templates/requirements/
            Requirements::customScript('
                window.initialReactData = JSON.parse(`' . $this->feedViewableData() . '`);
            ');
            Requirements::javascript(ThemeResourceLoader::inst()->findThemedJavascript('browser-bundle'), ['defer' => true]);
        }

        public function index(HTTPRequest $request)
        {
            // Format nav links with children
            $formattedNavLinks = [];
            foreach($this->Menu(1) as $navLink){
                $formattedNavLink = $navLink->toMap();
                $formattedNavLink['Children'] = $navLink->Children()->toNestedArray();
                array_push($formattedNavLinks, $formattedNavLink);
            }
            
            // Start Server Side Rendering
            $engine = new Node(Environment::getEnv('SERVER_NODE_PATH'), Environment::getEnv('SERVER_TEMP_PATH'));
            $renderer = new Renderer($engine);
            $serverRenderedHTML = $renderer
                ->entry(__DIR__ . '/../../' . ThemeResourceLoader::inst()->findThemedJavascript('server-bundle'))
                ->context('viewableData', $this->feedViewableData())
                ->context('navLinks', $formattedNavLinks)
                ->context('ClassName', $this->ClassName)
                ->render();
            return $this->customise([
                'ServerRenderedHTML' => $serverRenderedHTML
            ]);

        }

        public function feedViewableData()
        {
            $viewableData = [
                'Title' => $this->Title,
                'Content' => $this->Content,
                'SiteConfig_SocialLinks' => $this->SiteConfig->SocialLinks()->toNestedArray()
            ];
            return json_encode($viewableData);
        }
    }
}
