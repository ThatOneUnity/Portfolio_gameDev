(() => {
  // Russian copy lives in the HTML so both pages remain readable without JavaScript.
  const english = {
    "homeMeta": "Gameplay programming portfolio featuring Wild Egypt, a first-person voxel shooter in Unity 6 and C#, plus a published VRChat world and an Udon Graph interaction.",
    "homeTitle": "Playable Worlds | Gameplay Programmer",
    "skipLink": "Skip to content",
    "brandLabel": "Playable Worlds home",
    "navLabel": "Main navigation",
    "navProject": "Project",
    "navAbout": "About",
    "navContact": "Contact",
    "languageLabel": "Site language",
    "footerLine": "I love making games",
    "heroGameplay": "Gameplay",
    "heroProgrammer": "Programmer",
    "heroBio": "I build gameplay systems in Unity 6 and C#.",
    "viewProject": "View project",
    "artLabel": "Concept art",
    "projectStatus": "In development",
    "projectGenre": "University graduation project · First-person voxel shooter",
    "projectCapture": "Project Capture",
    "contributionTitle": "My Contribution",
    "shooting": "Shooting & Reload",
    "shootingDescription": "Firing, fire mode switching, and reload animation logic.",
    "waves": "Enemy Waves",
    "wavesDescription": "Different waves feature different enemies.",
    "behavior": "Enemy Behavior",
    "behaviorDescription": "Enemy behavior logic for when enemies lose sight of the player.",
    "environment": "Environment Interactions",
    "environmentDescription": "Fuel barrels explode once, and water slows movement.",
    "shop": "In-Game Shop",
    "shopDescription": "Implemented in-game item purchases using game managers.",
    "ui": "Game UI",
    "uiDescription": "A clear interface that stays out of the way during play.",
    "mechanicsTitle": "Mechanics in Focus",
    "weaponsCapture": "Weapon Controls Capture",
    "weaponsTitle": "Weapon Controls",
    "weaponsBody": "Switch fire modes during play. Reloading has its own animation logic.",
    "levelCapture": "Level Interactions Capture",
    "levelTitle": "Level Interactions",
    "levelBody": "Shallow water slows movement, and explosive barrels can detonate.",
    "enemiesTitle": "Enemy Systems",
    "wavesTitle": "Wave Encounters",
    "waveDetail": "The lineup of enemies changes from wave to wave.",
    "behaviorDetail": "I implemented enemy behavior, including what enemies do when they lose sight of the player.",
    "enemiesCapture": "Enemy Gameplay Capture",
    "shopTitle": "Shop & Interface",
    "shopDetail": "Players can buy items from the in-game shop. Game managers handle the purchase logic.",
    "uiDetail": "I implemented the interface players interact with during play.",
    "shopCapture": "Shop & UI Capture",
    "aboutTeaserTitle": "About Me",
    "aboutTeaser": "I’m looking to join a team as a Gameplay Programmer. My current project spans combat, enemy behavior, and interactions with the level.",
    "readBio": "Read my bio",
    "aboutMeta": "About the gameplay programmer developing Wild Egypt, a first-person voxel shooter in Unity 6.",
    "aboutTitle": "About | Playable Worlds",
    "aboutHeadingOne": "About",
    "aboutHeadingTwo": "Me",
    "aboutRole": "Gameplay Programmer",
    "bioIntro": "I'm Erik, a 21-year-old game development student looking for a gameplay programming role. For my university graduation project, I'm building Wild Egypt, a first-person voxel shooter in Unity 6 and C#.",
    "bioContribution": "For Wild Egypt, I implemented weapon firing, fire mode switching, and reload animation logic. I also built enemy waves and behavior, environment interactions, the in-game shop, and the player interface. The game is still in development.",
    "bioVrchat": "Before Wild Egypt, I modded games and created worlds and avatars for VRChat. I used Udon Graph visual scripting to build interactions for VRChat worlds.",
    "bioTools": "I also worked on 3D modeling and texturing in Cinema 4D, Blender 5, and Substance 3D Painter.",
    "bioProject": "View Wild Egypt",
    "bioVrchatLink": "VRChat Work",
    "vrchatTitle": "VRChat Work",
    "vrchatGraphAlt": "Udon Graph screenshot showing the Interact event and the logic that changes the fog",
    "vrchatGraphTitle": "Button-Controlled Fog",
    "vrchatGraphBody": "When the player presses the button, the graph changes the fog color and sets a new target density. The fog then gradually transitions to that density.",
    "vrchatGraphOpen": "Open full-size graph",
    "vrchatWorldAlt": "VRChat world interior with a fireplace and warm lighting, shown in the Unity Editor",
    "vrchatWorldStatus": "Published world",
    "vrchatWorldTitle": "Watch Party Room",
    "vrchatWorldBody": "I created and published a VRChat world where players can get together, chat, and watch something on a big screen. The screen is outside the frame in this Unity Editor view."
  };
  const storageKey = 'playable-worlds-language';
  const messages = [
    ['data-i18n', null],
    ['data-i18n-label', 'aria-label'],
    ['data-i18n-content', 'content'],
    ['data-i18n-alt', 'alt'],
  ].flatMap(([marker, attribute]) =>
    Array.from(document.querySelectorAll(`[${marker}]`), (element) => ({
      element,
      attribute,
      russian: attribute ? element.getAttribute(attribute) : element.textContent,
      english: english[element.getAttribute(marker)],
    }))
  );

  const switcher = document.querySelector('.language-switch');
  const buttons = Array.from(switcher.querySelectorAll('button[data-language]'));
  const links = document.querySelectorAll('[data-language-link]');
  const page = new URL(window.location.href);

  function supported(language) {
    return language === 'ru' || language === 'en';
  }

  function savedLanguage() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  function render(language) {
    document.documentElement.lang = language;
    for (const message of messages) {
      const text = language === 'en' ? message.english : message.russian;
      if (message.attribute) message.element.setAttribute(message.attribute, text);
      else message.element.textContent = text;
    }
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    }
    for (const link of links) {
      const destination = new URL(link.getAttribute('href'), window.location.href);
      destination.searchParams.set('lang', language);
      link.href = destination.href;
    }
  }

  const requested = page.searchParams.get('lang');
  const saved = savedLanguage();
  render(supported(requested) ? requested : supported(saved) ? saved : 'ru');

  switcher.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-language]');
    if (!button) return;
    const language = button.dataset.language;
    render(language);
    try {
      window.localStorage.setItem(storageKey, language);
    } catch {
      // The language still travels with links when browser storage is unavailable.
    }
    if (page.protocol === 'http:' || page.protocol === 'https:') {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', language);
      window.history.replaceState(window.history.state, '', url);
    }
  });
  switcher.hidden = false;
})();
