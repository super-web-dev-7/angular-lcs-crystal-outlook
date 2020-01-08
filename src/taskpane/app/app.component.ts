import { Component } from "@angular/core";
const template = require("./app.component.html");
/* global require */
declare var $:any;
@Component({
  selector: "app-home",
  template
})
export default class AppComponent {
  welcomeMessage = "Welcome";
  ngOnInit(){
      $('.ui.dropdown').dropdown();
      $(".ui.modal").modal("show");
        // Semantic UI Range
        $('.ui.range').range({
          min: 0,
          max: 10,
          start: 10,
          step: 1,
        });
      
        $('#smooth').range({
          min: 0,
          max: 10,
          start: 5,
          smooth: true,
        });
      
        $('#double').range({
          min: 0,
          max: 10,
          start: 5,
          step: 1,
          verbose: true,
          debug: true,
          onChange: function(value) {
            var
              $self = $(this),
              firstVal = $self.range('get thumb value'),
              secVal = $self.range('get thumb value', 'second');
            $('#display-d').html('|' + firstVal + " - " + secVal + '| = ' + value);
          }
        });
      
        $('#range-0').range({
          min: 0,
          max: 10,
          start: 5,
          labelType: 'letter'
        });
      
        // No Step
        $('#range-1').range({
          min: 0,
          max: 10,
          start: 5,
          step: 0,
          onChange: function(value) {
            $('#display-1').html(value);
          }
        });
      
        // Place value in an input
        $('#range-2').range({
          min: 0,
          max: 10,
          start: 5,
          input: '#input-2'
        });
      
        // Or use a custom callback
        $('#range-3').range({
          min: 0,
          max: 10,
          start: 5,
          onChange: function(value) {
            $('#display-3').html(value);
          }
        });
      
        // Set custom step
        $('#range-4').range({
          min: 0,
          max: 10,
          start: 4,
          step: 2,
          input: '#input-4'
        });
      
  }
  async run() {
    /**
     * Insert your Outlook code here
     */
  }
}
