module.exports = {
	"extends": "airbnb",
	"rules": {
    "react/prop-types": 0,
    "comma-dangle": ["error", "never"],
    "camelcase": 0,
    "max-len": 0,
    "jsx-a11y/media-has-caption": 0,
    "jsx-a11y/no-static-element-interactions": 0
	},
	"globals": {
    "chrome": true,
		"document": true,
		"window": true,
    "sessionStorage": true,
    "Audio": true,
    "localStorage": true
	},
  "env": {
    "jest": true
  }
}
