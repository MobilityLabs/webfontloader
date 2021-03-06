goog.provide('webfont.modules.google.FontApiUrlBuilder');

/**
 * @constructor
 */
webfont.modules.google.FontApiUrlBuilder = function(apiUrl, text, display, effect, version) {
  this.apiVersion_ = version === 2 ? 2 : 1;
  const urlComponents = webfont.modules.google.FontApiUrlBuilder.DEFAULT_API_URL_COMPONENTS[this.apiVersion_ - 1];
  if (apiUrl) {
    this.apiUrl_ = apiUrl;
    this.apiSeparator_ = urlComponents[1];
  } else {
    this.apiUrl_ = urlComponents[0];
    this.apiSeparator_ = urlComponents[1];
  }
  this.fontFamilies_ = [];
  this.subsets_ = [];
  this.text_ = text || '';
  this.display_ = display || '';
  this.effect_ = effect || '';
};

webfont.modules.google.FontApiUrlBuilder.DEFAULT_API_URL_COMPONENTS = [
  ['https://fonts.googleapis.com/css', '%7C' ],
  ['https://fonts.googleapis.com/css2', '&family=']
];

webfont.modules.google.FontApiUrlBuilder.DEFAULT_API_URL = webfont.modules.google.FontApiUrlBuilder.DEFAULT_API_URL_COMPONENTS[0][0];
webfont.modules.google.FontApiUrlBuilder.DEFAULT_API_URL_V2 = webfont.modules.google.FontApiUrlBuilder.DEFAULT_API_URL_COMPONENTS[1][0];

goog.scope(function () {
  var FontApiUrlBuilder = webfont.modules.google.FontApiUrlBuilder;

  FontApiUrlBuilder.prototype.setFontFamilies = function(fontFamilies) {
    this.parseFontFamilies_(fontFamilies);
  };


  FontApiUrlBuilder.prototype.parseFontFamilies_ =
      function(fontFamilies) {
    var length = fontFamilies.length;

    for (var i = 0; i < length; i++) {
      var elements = fontFamilies[i].split(':');

      if (elements.length == 3) {
        this.subsets_.push(elements.pop());
      }
      var joinCharacter = '';
      if (elements.length == 2 && elements[1] != ''){
        joinCharacter = ':';
      }
      this.fontFamilies_.push(elements.join(joinCharacter));
    }
  };


  FontApiUrlBuilder.prototype.webSafe = function(string) {
    return string.replace(/ /g, '+');
  };


  FontApiUrlBuilder.prototype.build = function() {
    if (this.fontFamilies_.length == 0) {
      throw new Error('No fonts to load!');
    }
    if (this.apiUrl_.indexOf("kit=") != -1) {
      return this.apiUrl_;
    }
    var length = this.fontFamilies_.length;
    var sb = [];

    for (var i = 0; i < length; i++) {
      sb.push(this.webSafe(this.fontFamilies_[i]));
    }
    var url = this.apiUrl_ + '?family=' + sb.join(this.apiSeparator_);

    if (this.subsets_.length > 0) {
      url += '&subset=' + this.subsets_.join(',');
    }

    if (this.text_.length > 0) {
      url += '&text=' + encodeURIComponent(this.text_);
    }

    if (this.display_.length > 0) {
      url += '&display=' + encodeURIComponent(this.display_);
    }

    if (this.effect_.length > 0) {
      url += '&effect=' + encodeURIComponent(this.effect_);
    }

    return url;
  };
});
