import type { WCAGGuideline } from '../types';

export const WCAG_2_2_GUIDELINES: WCAGGuideline[] = [
  // Principle 1: Perceivable
  {
    id: "1.1.1",
    level: "A",
    title: "Non-text Content",
    description:
      'All non-text content (images, icons, charts, buttons, form inputs) must have meaningful text alternatives that convey the same information or function. Use alt attributes for images, aria-label for icons, and ensure decorative elements are marked as such (alt="" or role="presentation"). This helps screen readers understand visual content.',
    url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
  },
  {
    id: "1.2.1",
    level: "A",
    title: "Audio-only and Video-only (Prerecorded)",
    description:
      "For prerecorded audio-only content (podcasts, music), provide a text transcript. For video-only content (silent animations, visual demonstrations), provide audio description or text alternative that describes the visual information. This ensures users who cannot see or hear the content can still access the information.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html",
  },
  {
    id: "1.2.2",
    level: "A",
    title: "Captions (Prerecorded)",
    description:
      "All prerecorded videos with audio must have synchronized captions that include dialogue, sound effects, and other relevant audio information. Captions should be accurate, well-positioned, and synchronized with the audio. Use proper caption formatting and ensure they don't obscure important visual content.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html",
  },
  {
    id: "1.2.3",
    level: "A",
    title: "Audio Description or Media Alternative (Prerecorded)",
    description:
      "An alternative for time-based media or audio description is provided for prerecorded video.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/audio-description-or-media-alternative-prerecorded.html",
  },
  {
    id: "1.2.4",
    level: "AA",
    title: "Captions (Live)",
    description:
      "Captions are provided for all live audio content in synchronized media.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html",
  },
  {
    id: "1.2.5",
    level: "AA",
    title: "Audio Description (Prerecorded)",
    description:
      "Audio description is provided for all prerecorded video content in synchronized media.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html",
  },
  {
    id: "1.2.6",
    level: "AAA",
    title: "Sign Language (Prerecorded)",
    description:
      "Sign language interpretation is provided for all prerecorded audio content.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/sign-language-prerecorded.html",
  },
  {
    id: "1.2.7",
    level: "AAA",
    title: "Extended Audio Description (Prerecorded)",
    description:
      "Extended audio description is provided for all prerecorded video content.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/extended-audio-description-prerecorded.html",
  },
  {
    id: "1.2.8",
    level: "AAA",
    title: "Media Alternative (Prerecorded)",
    description:
      "An alternative for time-based media is provided for all prerecorded synchronized media.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/media-alternative-prerecorded.html",
  },
  {
    id: "1.2.9",
    level: "AAA",
    title: "Audio-only (Live)",
    description:
      "An alternative that presents equivalent information for live audio-only content is provided.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/audio-only-live.html",
  },
  {
    id: "1.3.1",
    level: "A",
    title: "Info and Relationships",
    description:
      "Use proper semantic HTML elements and ARIA attributes to convey information structure and relationships. Headings should be properly nested (h1→h2→h3), form labels must be associated with inputs, lists should use ul/ol/li elements, and table data should include proper headers. This allows assistive technology to understand and navigate the content structure.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
  },
  {
    id: "1.3.2",
    level: "A",
    title: "Meaningful Sequence",
    description:
      "Ensure content is presented in a logical order that makes sense when accessed sequentially (like tab navigation or screen reader flow). The DOM order should match the visual order, and CSS positioning should not create misleading reading sequences. This is crucial for keyboard navigation and screen reader users.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html",
  },
  {
    id: "1.3.3",
    level: "A",
    title: "Sensory Characteristics",
    description:
      'Instructions and content should not rely solely on sensory characteristics like shape, color, size, visual location, orientation, or sound. For example, don\'t say "click the green button" or "the item on the right" - also provide text labels or other identifying information that doesn\'t depend on sensory perception.',
    url: "https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html",
  },
  {
    id: "1.3.4",
    level: "AA",
    title: "Orientation",
    description:
      "Content does not restrict its view and operation to a single display orientation.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/orientation.html",
  },
  {
    id: "1.3.5",
    level: "AA",
    title: "Identify Input Purpose",
    description:
      "The purpose of each input field can be programmatically determined.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html",
  },
  {
    id: "1.3.6",
    level: "AAA",
    title: "Identify Purpose",
    description:
      "The purpose of User Interface Components, icons, and regions can be programmatically determined.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/identify-purpose.html",
  },
  {
    id: "1.4.1",
    level: "A",
    title: "Use of Color",
    description:
      "Color alone cannot be the only way to convey information, indicate an action, prompt a response, or distinguish elements. Always pair color with other visual indicators like text, icons, patterns, or borders. For example, form validation errors should use both red color AND error icons or text labels.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html",
  },
  {
    id: "1.4.2",
    level: "A",
    title: "Audio Control",
    description:
      "If audio plays automatically for more than 3 seconds, there is a mechanism to pause, stop, or control volume.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html",
  },
  {
    id: "1.4.3",
    level: "AA",
    title: "Contrast (Minimum)",
    description:
      "Text and background colors must have sufficient contrast: at least 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold), and 3:1 for UI components and graphical elements. Use contrast checking tools to verify. This ensures text is readable for users with visual impairments or in various lighting conditions.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
  },
  {
    id: "1.4.4",
    level: "AA",
    title: "Resize Text",
    description:
      "Text can be resized without assistive technology up to 200 percent without loss of content or functionality.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html",
  },
  {
    id: "1.4.5",
    level: "AA",
    title: "Images of Text",
    description:
      "If technologies can achieve the visual presentation, text is used to convey information rather than images of text.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html",
  },
  {
    id: "1.4.6",
    level: "AAA",
    title: "Contrast (Enhanced)",
    description:
      "The visual presentation of text and images has a contrast ratio of at least 7:1.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html",
  },
  {
    id: "1.4.7",
    level: "AAA",
    title: "Low or No Background Audio",
    description:
      "For prerecorded audio-only content, background sounds are low or can be turned off.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/low-or-no-background-audio.html",
  },
  {
    id: "1.4.8",
    level: "AAA",
    title: "Visual Presentation",
    description:
      "For the visual presentation of blocks of text, a mechanism is available to achieve specific presentation.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html",
  },
  {
    id: "1.4.9",
    level: "AAA",
    title: "Images of Text (No Exception)",
    description:
      "Images of text are only used for pure decoration or where a particular presentation of text is essential.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/images-of-text-no-exception.html",
  },
  {
    id: "1.4.10",
    level: "AA",
    title: "Reflow",
    description:
      "Content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html",
  },
  {
    id: "1.4.11",
    level: "AA",
    title: "Non-text Contrast",
    description:
      "The visual presentation of User Interface Components and graphical objects have a contrast ratio of at least 3:1.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html",
  },
  {
    id: "1.4.12",
    level: "AA",
    title: "Text Spacing",
    description:
      "No loss of content or functionality occurs by setting specific text spacing properties.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html",
  },
  {
    id: "1.4.13",
    level: "AA",
    title: "Content on Hover or Focus",
    description:
      "Where receiving and then removing pointer hover or keyboard focus triggers additional content to become visible and then hidden.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html",
  },

  // Principle 2: Operable
  {
    id: "2.1.1",
    level: "A",
    title: "Keyboard",
    description:
      "All interactive functionality must be accessible using only a keyboard. Users should be able to navigate, activate buttons, fill forms, and access all features using Tab, Enter, Space, and arrow keys. Ensure proper focus management and provide visible focus indicators. Custom components may need additional keyboard event handlers.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
  },
  {
    id: "2.1.2",
    level: "A",
    title: "No Keyboard Trap",
    description:
      "Users must be able to navigate away from any component using standard keyboard navigation (Tab, Shift+Tab, Escape). Avoid focus traps unless they serve a specific purpose (like modal dialogs), and always provide a clear way to exit. Modal dialogs should trap focus within them but allow closing with Escape key.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html",
  },
  {
    id: "2.1.3",
    level: "AAA",
    title: "Keyboard (No Exception)",
    description:
      "All functionality of the content is operable through a keyboard interface without exception.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard-no-exception.html",
  },
  {
    id: "2.1.4",
    level: "A",
    title: "Character Key Shortcuts",
    description:
      "If a keyboard shortcut is implemented using only letter, punctuation, number, or symbol characters, then it can be turned off, remapped, or is only active when the component has focus.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html",
  },
  {
    id: "2.2.1",
    level: "A",
    title: "Timing Adjustable",
    description:
      "For each time limit that is set by the content, users can turn off, adjust, or extend the time limit.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html",
  },
  {
    id: "2.2.2",
    level: "A",
    title: "Pause, Stop, Hide",
    description:
      "For moving, blinking, scrolling, or auto-updating information, users can pause, stop, or hide it.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html",
  },
  {
    id: "2.2.3",
    level: "AAA",
    title: "No Timing",
    description:
      "Timing is not an essential part of the event or activity presented by the content.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/no-timing.html",
  },
  {
    id: "2.2.4",
    level: "AAA",
    title: "Interruptions",
    description: "Interruptions can be postponed or suppressed by the user.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/interruptions.html",
  },
  {
    id: "2.2.5",
    level: "AAA",
    title: "Re-authenticating",
    description:
      "When an authenticated session expires, the user can continue the activity without loss of data after re-authenticating.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/re-authenticating.html",
  },
  {
    id: "2.2.6",
    level: "AAA",
    title: "Timeouts",
    description:
      "Users are warned of the duration of any user inactivity that could cause data loss.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/timeouts.html",
  },
  {
    id: "2.3.1",
    level: "A",
    title: "Three Flashes or Below Threshold",
    description:
      "Web pages do not contain anything that flashes more than three times in any one second period.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html",
  },
  {
    id: "2.3.2",
    level: "AAA",
    title: "Three Flashes",
    description:
      "Web pages do not contain anything that flashes more than three times in any one second period.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/three-flashes.html",
  },
  {
    id: "2.3.3",
    level: "AAA",
    title: "Animation from Interactions",
    description:
      "Motion animation triggered by interaction can be disabled, unless the animation is essential to the functionality or the information being conveyed.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html",
  },
  {
    id: "2.4.1",
    level: "A",
    title: "Bypass Blocks",
    description:
      "A mechanism is available to bypass blocks of content that are repeated on multiple Web pages.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html",
  },
  {
    id: "2.4.2",
    level: "A",
    title: "Page Titled",
    description: "Web pages have titles that describe topic or purpose.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html",
  },
  {
    id: "2.4.3",
    level: "A",
    title: "Focus Order",
    description:
      "If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operability.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html",
  },
  {
    id: "2.4.4",
    level: "A",
    title: "Link Purpose (In Context)",
    description:
      "The purpose of each link can be determined from the link text alone or from the link text together with its programmatically determined link context.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html",
  },
  {
    id: "2.4.5",
    level: "AA",
    title: "Multiple Ways",
    description:
      "More than one way is available to locate a Web page within a set of Web pages.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways.html",
  },
  {
    id: "2.4.6",
    level: "AA",
    title: "Headings and Labels",
    description: "Headings and labels describe topic or purpose.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html",
  },
  {
    id: "2.4.7",
    level: "AA",
    title: "Focus Visible",
    description:
      "Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html",
  },
  {
    id: "2.4.8",
    level: "AAA",
    title: "Location",
    description:
      "Information about the user's location within a set of Web pages is available.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/location.html",
  },
  {
    id: "2.4.9",
    level: "AAA",
    title: "Link Purpose (Link Only)",
    description:
      "A mechanism is available to allow the purpose of each link to be identified from link text alone.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-link-only.html",
  },
  {
    id: "2.4.10",
    level: "AAA",
    title: "Section Headings",
    description: "Section headings are used to organize the content.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/section-headings.html",
  },
  {
    id: "2.4.11",
    level: "AA",
    title: "Focus Not Obscured (Minimum)",
    description:
      "When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html",
  },
  {
    id: "2.4.12",
    level: "AAA",
    title: "Focus Not Obscured (Enhanced)",
    description:
      "When a user interface component receives keyboard focus, no part of the component is hidden by author-created content.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced.html",
  },
  {
    id: "2.4.13",
    level: "AAA",
    title: "Focus Appearance",
    description:
      "When the keyboard focus indicator is visible, an area of the focus indicator meets specific size and contrast requirements.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html",
  },
  {
    id: "2.5.1",
    level: "A",
    title: "Pointer Gestures",
    description:
      "All functionality that uses multipoint or path-based gestures for operation can be operated with a single pointer without a path-based gesture.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html",
  },
  {
    id: "2.5.2",
    level: "A",
    title: "Pointer Cancellation",
    description:
      "For functionality that can be operated using a single pointer, specific requirements for down-event and up-event are met.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html",
  },
  {
    id: "2.5.3",
    level: "A",
    title: "Label in Name",
    description:
      "For user interface components with labels that include text or images of text, the name contains the text that is presented visually.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html",
  },
  {
    id: "2.5.4",
    level: "A",
    title: "Motion Actuation",
    description:
      "Functionality that can be operated by device motion or user motion can also be operated by user interface components.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/motion-actuation.html",
  },
  {
    id: "2.5.5",
    level: "AAA",
    title: "Target Size (Enhanced)",
    description:
      "The size of the target for pointer inputs is at least 44 by 44 CSS pixels.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html",
  },
  {
    id: "2.5.6",
    level: "AAA",
    title: "Concurrent Input Mechanisms",
    description:
      "Web content does not restrict use of input modalities available on a platform.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/concurrent-input-mechanisms.html",
  },
  {
    id: "2.5.7",
    level: "AA",
    title: "Dragging Movements",
    description:
      "All functionality that uses a dragging movement for operation can be achieved by a single pointer without dragging.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html",
  },
  {
    id: "2.5.8",
    level: "AA",
    title: "Target Size (Minimum)",
    description:
      "The size of the target for pointer inputs is at least 24 by 24 CSS pixels.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html",
  },

  // Principle 3: Understandable
  {
    id: "3.1.1",
    level: "A",
    title: "Language of Page",
    description:
      "The default human language of each Web page can be programmatically determined.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html",
  },
  {
    id: "3.1.2",
    level: "AA",
    title: "Language of Parts",
    description:
      "The human language of each passage or phrase in the content can be programmatically determined.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html",
  },
  {
    id: "3.1.3",
    level: "AAA",
    title: "Unusual Words",
    description:
      "A mechanism is available for identifying specific definitions of words or phrases used in an unusual or restricted way.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/unusual-words.html",
  },
  {
    id: "3.1.4",
    level: "AAA",
    title: "Abbreviations",
    description:
      "A mechanism for identifying the expanded form or meaning of abbreviations is available.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/abbreviations.html",
  },
  {
    id: "3.1.5",
    level: "AAA",
    title: "Reading Level",
    description:
      "When text requires reading ability more advanced than the lower secondary education level, supplemental content or a version that does not require such reading ability is available.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html",
  },
  {
    id: "3.1.6",
    level: "AAA",
    title: "Pronunciation",
    description:
      "A mechanism is available for identifying specific pronunciation of words where meaning of the words is ambiguous without knowing the pronunciation.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/pronunciation.html",
  },
  {
    id: "3.2.1",
    level: "A",
    title: "On Focus",
    description:
      "When any user interface component receives focus, it does not initiate a change of context.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html",
  },
  {
    id: "3.2.2",
    level: "A",
    title: "On Input",
    description:
      "Changing the setting of any user interface component does not automatically cause a change of context.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/on-input.html",
  },
  {
    id: "3.2.3",
    level: "AA",
    title: "Consistent Navigation",
    description:
      "Navigational mechanisms that are repeated on multiple Web pages occur in the same relative order each time they are repeated.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html",
  },
  {
    id: "3.2.4",
    level: "AA",
    title: "Consistent Identification",
    description:
      "Components that have the same functionality are identified consistently.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html",
  },
  {
    id: "3.2.5",
    level: "AAA",
    title: "Change on Request",
    description:
      "Changes of context are initiated only by user request or a mechanism is available to turn off such changes.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/change-on-request.html",
  },
  {
    id: "3.2.6",
    level: "AAA",
    title: "Consistent Help",
    description:
      "If a Web page contains any of the specific help mechanisms, it is in the same relative order on each Web page.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html",
  },
  {
    id: "3.3.1",
    level: "A",
    title: "Error Identification",
    description:
      'When form validation detects errors, clearly identify which fields have problems and describe the error in text. Use aria-describedby to associate error messages with form fields, provide clear error messages (not just "invalid"), and ensure screen readers can access the error information. Visual indicators alone (like red borders) are not sufficient.',
    url: "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html",
  },
  {
    id: "3.3.2",
    level: "A",
    title: "Labels or Instructions",
    description:
      'Every form input must have a clear, descriptive label or instructions. Use proper <label> elements with "for" attributes, or aria-label/aria-labelledby for custom inputs. Include format requirements (like date formats), required field indicators, and any constraints. Placeholder text alone is not sufficient as it disappears when typing.',
    url: "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html",
  },
  {
    id: "3.3.3",
    level: "AA",
    title: "Error Suggestion",
    description:
      'When validation errors occur and you know how to fix them, provide specific suggestions to help users correct the mistakes. Instead of "Invalid date" say "Enter date in MM/DD/YYYY format". For required fields, say "Email address is required". Make suggestions clear, actionable, and accessible to assistive technology.',
    url: "https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html",
  },
  {
    id: "3.3.4",
    level: "AA",
    title: "Error Prevention (Legal, Financial, Data)",
    description:
      "For Web pages that cause legal commitments or financial transactions, submissions are reversible, checked, or confirmed.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html",
  },
  {
    id: "3.3.5",
    level: "AAA",
    title: "Help",
    description: "Context-sensitive help is available.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/help.html",
  },
  {
    id: "3.3.6",
    level: "AAA",
    title: "Error Prevention (All)",
    description:
      "For Web pages that require the user to submit information, submissions are reversible, checked, or confirmed.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-all.html",
  },
  {
    id: "3.3.7",
    level: "A",
    title: "Redundant Entry",
    description:
      "Information previously entered by or provided to the user is either auto-populated or available for selection.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html",
  },
  {
    id: "3.3.8",
    level: "AA",
    title: "Accessible Authentication (Minimum)",
    description:
      "A cognitive function test is not required for any step in an authentication process unless specific conditions are met.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html",
  },
  {
    id: "3.3.9",
    level: "AAA",
    title: "Accessible Authentication (Enhanced)",
    description:
      "A cognitive function test is not required for any step in an authentication process.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-enhanced.html",
  },

  // Principle 4: Robust
  {
    id: "4.1.1",
    level: "A",
    title: "Parsing",
    description:
      "In content implemented using markup languages, elements have complete start and end tags and are nested according to their specifications.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/parsing.html",
  },
  {
    id: "4.1.2",
    level: "A",
    title: "Name, Role, Value",
    description:
      "For all user interface components, the name and role can be programmatically determined.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
  },
  {
    id: "4.1.3",
    level: "AA",
    title: "Status Messages",
    description:
      "In content implemented using markup languages, status messages can be programmatically determined through role or properties.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html",
  },
];

export const getGuidelinesByVersion = (version: string): WCAGGuideline[] => {
  // For now, we only have WCAG 2.2. In the future, this could be extended
  // to support different versions by filtering or loading different datasets
  if (version === '2.2') {
    return WCAG_2_2_GUIDELINES;
  }
  
  // Default to 2.2 if version not found
  return WCAG_2_2_GUIDELINES;
};

export const getGuidelineById = (id: string, version: string = '2.2'): WCAGGuideline | undefined => {
  const guidelines = getGuidelinesByVersion(version);
  return guidelines.find(guideline => guideline.id === id);
};