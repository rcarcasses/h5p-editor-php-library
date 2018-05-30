var H5PEditor = H5PEditor || {};
var ns = H5PEditor;

/**
 * Construct a form from library semantics.
 */
ns.Form = function () {
  var self = this;

  this.params = {};
  this.passReadies = false;
  this.commonFields = {};

  const metadataButton = '' +
  '<div class="h5p-metadata-button-wrapper">' +
    '<div class="h5p-metadata-button-tip"></div>' +
    '<div class="toggle-metadata">' + ns.t('core', 'metadata') + '</div>' +
  '</div>';

  this.$form = ns.$('' +
    '<div class="h5peditor-form">' +
      '<div class="tree">' +
        '<div class="overlay"></div>' +
        '<div class="field field-name-title text">' +
          '<div class="h5p-editor-flex-wrapper">' +
            '<label class="h5peditor-label-wrapper"><span class="h5peditor-label h5peditor-required">' + ns.t('core', 'title') + '</span></label>' +
            metadataButton +
          '</div>' +
          '<div class="h5peditor-field-description">' + ns.t('core', 'usedForSearchingReportsAndCopyrightInformation') + '</div>' +
          '<input class="h5peditor-text" id="metadata-title-main" type="text" maxlength="255" placeholder="' + ns.t('core', 'addTitle') +'">' +
        '</div>' +
      '</div>' +
      '<div class="common collapsed hidden">' +
        '<div class="fields">' +
          '<p class="desc">' +
            ns.t('core', 'commonFieldsDescription') +
          '</p>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
  this.$common = this.$form.find('.common > .fields');
  this.library = '';

  this.$form.find('.toggle-metadata').click(function () {
    self.$form.find('.h5p-metadata-wrapper').first().toggleClass('h5p-open');
    self.$form.find('.overlay').toggle();
  });

  // Add title expand/collapse button
  ns.$('<div/>', {
    'class': 'h5peditor-label',
    title: ns.t('core', 'expandCollapse'),
    role: 'button',
    tabIndex: 0,
    html: '<span class="icon"></span>' + ns.t('core', 'commonFields'),
    on: {
      click: function () {
        self.$common.parent().toggleClass('collapsed');
      },
      keypress: function (event) {
        if ((event.charCode || event.keyCode) === 32) {
          self.$common.parent().toggleClass('collapsed');
          event.preventDefault();
        }
      }
    },
    prependTo: this.$common.parent()
  });

  // Alternate background colors
  this.zebra = "odd";
};

/**
 * Replace the given element with our form.
 *
 * @param {jQuery} $element
 * @returns {undefined}
 */
ns.Form.prototype.replace = function ($element) {
  $element.replaceWith(this.$form);
  this.offset = this.$form.offset();
  // Prevent inputs and selects in an h5peditor form from submitting the main
  // framework form.
  this.$form.on('keydown', 'input,select', function (event) {
    if (event.keyCode === 13) {
      // Prevent enter key from submitting form.
      return false;
    }
  });
};

/**
 * Remove the current form.
 */
ns.Form.prototype.remove = function () {
  ns.removeChildren(this.children);
  this.$form.remove();
};

/**
 * Wrapper for processing the semantics.
 *
 * @param {Array} semantics
 * @param {Object} defaultParams
 * @returns {undefined}
 */
ns.Form.prototype.processSemantics = function (semantics, defaultParams, metadata) {
  this.metadata = (metadata ? metadata : defaultParams.metadata || {});
  H5PEditor.metadataForm(semantics, this.metadata, this.$form.children('.tree'), this, 'main');

  // Overriding this.params with {} will lead to old content not being editable for now
  this.params = (defaultParams.params? defaultParams.params : defaultParams);
  ns.processSemanticsChunk(semantics, this.params, this.$form.children('.tree'), this);
};

/**
 * Collect functions to execute once the tree is complete.
 *
 * @param {function} ready
 * @returns {undefined}
 */
ns.Form.prototype.ready = function (ready) {
  this.readies.push(ready);
};

/**
 * Sync title field with other title field
 *
 * @param {jQuery} $inputField Inputfield to sync with.
 * @return {jQuery} Inputfield that's listening.
 */
ns.Form.prototype.syncTitle = function($inputField) {
  const $titleFieldMain = this.$form.find('input#metadata-title-main');

  // Remove old Listener, just in case ...
  $inputField.off('input.titleFieldMain');

  // Initialize
  $titleFieldMain.val($inputField.val());

  // Sync
  $inputField.on('input.titleFieldMain', function() {
    $titleFieldMain.val($inputField.val());
  });

  return $titleFieldMain;
};
