/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

/* beautify preserve:start */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
/* beautify preserve:end */

import "oe-i18n-msg/oe-i18n-msg.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/paper-button/paper-button.js";
import '@polymer/iron-icon/iron-icon.js';
import './oe-message-handler'

var OeMessageHandler = window.customElements.get("oe-message-handler");
/**
 * # oe-extended-message-handler
 * `<oe-extended-message-handler>` is an implementaion of oe-message-handler using custom styles.
 * 
 * ## Styling
 * The following custom properties and mixins are available for styling:
 * 
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--oe-message-success-background` | The background color of the success | `#ffffff`
 * `--oe-message-success-border-left-color` | Border left color for success notification bar | `#36B37E`
 * `--oe-message-info-background`   | The background color of the message   | `#ffffff`
 * `--oe-message-info-border-left-color` | Border left color for message notification bar | `#006BFF`
 * `--oe-message-warning-background` | The background color of the warning | `#ffffff`
 * `--oe-message-warning-border-left-color` | Border left color for warning notification bar | `#FFAB00`
 * `--oe-message-error-background`   | The background color of the error   | `#ffffff`
 * `--oe-message-error-border-left-color` | Border left color for error notification bar | `#F04646`
 * 
 * 
 * @customElement
 * @polymer
 * @demo demo/demo-oe-extended-message-handler.html
 */
class OeExtendedMessageHandler extends OeMessageHandler {
  static get is() {
    return 'oe-extended-message-handler';
  }

  static get template() {
    return html`
      <style>
        .success {
          background: var(--oe-message-success-background, #ffffff);
          color: var(--primary-text-color);
          border: 1px solid grey;
          border-radius: 5px;
          border-left-width: 10px;
          border-left-color: var(--oe-message-success-border-left-color,#36B37E);
        }

        .message {
          background: var(--oe-message-info-background, #ffffff);
          color: var(--primary-text-color);
          border: 1px solid grey;
          border-radius: 5px;
          border-left-width: 10px;
          border-left-color: var(--oe-message-info-border-left-color,#006BFF);
        }

        .warning {
          background: var(--oe-message-warning-background, #ffffff);
          color: var(--primary-text-color);
          border: 1px solid grey;
          border-radius: 5px;
          border-left-width: 10px;
          border-left-color: var(--oe-message-warning-border-left-color,#FFAB00);
        }

        .error {
          background: var(--oe-message-error-background, #ffffff);
          color: var(--primary-text-color);
          border: 1px solid grey;
          border-radius: 5px;
          border-left-width: 10px;
          border-left-color: var(--oe-message-error-border-left-color,#F04646);
        }

        paper-toast {
          @apply(--oe-message-handler-toast-mixin);
        }
        #closableOK {
          position: absolute;
          right: 0;
          top: 5px;
        }
        #closableOK_1 {
          position: absolute;
          right: 0;
          top: 5px;
        }
       
      </style>
      <oe-i18n-msg id="translator"></oe-i18n-msg>
      <paper-toast id="toast">

      </paper-toast>

      <paper-toast duration=0 id="messageClosable">
       <span><iron-icon icon="[[_icon]]" style="fill:[[_icon-color]]"></iron-icon></span>
       
      <label style="padding-left:16px">[[_message]]</label>
        <paper-button id="closableOK_1" on-tap="_closeMessageToast">
       
        <oe-i18n-msg msgid=[[okLabel]]>[[okLabel]]</oe-i18n-msg>
        </paper-button>
      </paper-toast>

      <paper-toast duration=0 id="closable">
       <span><iron-icon icon="[[_icon]]" style="fill:[[_icon-color]]"></iron-icon></span>
       
      <label style="padding-left:16px">[[_message]]</label>
        <paper-button id="closableOK" on-tap="_closeToast">
        <span><iron-icon icon="[[_iconclose]]"></iron-icon></span>
        </paper-button>
      </paper-toast>

      <paper-toast with-backdrop id="confirm">
        <paper-button id="cancel" on-tap="_choiceMade">
          <oe-i18n-msg msgid=[[cancelLabel]]>[[cancelLabel]]</oe-i18n-msg>
        </paper-button>
        <paper-button id="ok" on-tap="_choiceMade">
          <oe-i18n-msg msgid=[[okLabel]]>[[okLabel]]</oe-i18n-msg>
        </paper-button>
      </paper-toast>
      `;
  }

  showToast(type, data) {
    var toast = this.$.closable;

    var msgCode = data.code || data.message || data;
    //use data.message also, in case somebody is still passing only message as messageCode and expecting translation

    var placeholders = data.placeholders;
    var translatedMsg = this.$.translator.getInterpolatedMsg(msgCode, placeholders) || data.message || msgCode;
    var duration = data.forever ? 0 : this.duration;
    this.set('okLabel', data.okLabel || 'OK');
    this.set('_iconclose', 'close');
    this.set('cancelLabel', data.cancelLabel || 'Cancel');
    if (type === 'confirm') {
      toast = this.$.confirm;
    }
    else if (type === 'message' && data.okLabel === 'Open') {
      toast = this.$.messageClosable;
      this.$.closableOK_1.cb = data.ok;
      duration = 0;
    }
    else if (typeof data.ok === 'function' || (this.persistOn && this.persistOn.indexOf(type) >= 0)) {
      toast = this.$.closable;
      this.$.closableOK.cb = data.ok;
      duration = 0;
    }

    toast.hide();
    toast.set('duration', duration);

    if (type === 'warning') {
      this.set('_icon', 'error');
      this.set('_icon-color', '#FFAB00');
      this.set('_message', translatedMsg);
    }
    else if (type === 'error') {
      this.set('_icon', 'warning');
      this.set('_icon-color', '#F04646');
      this.set('_message', translatedMsg);
    }
    else if (type === 'success') {
      this.set('_icon', 'check-circle');
      this.set('_icon-color', '#36B37E');
      this.set('_message', translatedMsg);
    }
    else if (type === 'message') {
      this.set('_icon', 'info');
      this.set('_icon-color', '#006BFF');
      this.set('_message', translatedMsg);
    }
    else
      toast.set('text', translatedMsg);

    toast.classList.remove('success');
    toast.classList.remove('warning');
    toast.classList.remove('error');
    this.classList.remove('_message');
    toast.classList.remove('message');
    toast.classList.add(type);
    toast.show();
  }

  _closeMessageToast(e) {
    this.set('okLabel', 'OK');
    this.$.messageClosable.toggle();
    if (e.currentTarget.cb) {
      e.currentTarget.cb();
      e.currentTarget.cb = undefined;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.fitBottom) {
      this.$.messageClosable.classList.add('fit-bottom');
    }
  }
}

window.customElements.define(OeExtendedMessageHandler.is, OeExtendedMessageHandler);
