module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Ban Member",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "Member Control",

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${presets.getMemberText(data.member, data.varName)}`;
  },

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: ["member", "varName", "reason", "days"],

  //---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  //
  // The "data" parameter stores constants for select elements to use.
  // Each is an array: index 0 for commands, index 1 for events.
  // The names are: sendTargets, members, roles, channels,
  //                messages, servers, variables
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<member-input dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Reason</span><br>
	<textarea id="reason" class="dbm_monospace" rows="5" placeholder="Insert reason here..." style="white-space: nowrap; resize: none;"></textarea>
</div><br>

<div>
  <span class="dbminputlabel">Number of days of messages to delete</span>
  <input id="days" placeholder="Optional" class="round" type="text">
</div>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  //---------------------------------------------------------------------

  init() {},

  //---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  //---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.member, 10);
    const varName = this.evalMessage(data.varName, cache);
    const member = this.getMember(type, varName, cache);
    const reason = this.evalMessage(data.reason, cache);
    const days = parseInt(data.days, 10) || 0;
    if (Array.isArray(member)) {
      this.callListFunc(member, "ban", [{ days, reason }])
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else if (member?.ban) {
      member
        .ban({ days, reason })
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  //---------------------------------------------------------------------

  mod() {},
};
