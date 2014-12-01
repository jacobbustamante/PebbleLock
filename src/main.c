#include <pebble.h>
#include <time.h>

static void tick_handler(struct tm *tick_time, TimeUnits units_changed);
static void update_time();
void send_test();
void send_B();
void sent_B(char* B, char* salt);
void send_A(char* A);
   
#define FUNC_DATA 0
#define SALT_DATA 1
#define B_DATA 2
#define A_DATA 3
#define BEAT_DATA 4
#define TIME_DATA 5

static Window *my_window;
static TextLayer *text_layer;

static void tick_handler(struct tm *tick_time, TimeUnits units_changed) {
   update_time();
}

static void update_time() {
  // Get a tm structure
  time_t temp = time(NULL); 
  struct tm *tick_time = localtime(&temp);

  // Create a long-lived buffer
  static char buffer[] = "00:00:00";

  // Write the current hours and minutes into the buffer
  if(clock_is_24h_style() == true) {
    // Use 24 hour format
    strftime(buffer, sizeof("00:00:00"), "%H:%M:%S", tick_time);
  } else {
    // Use 12 hour format
    strftime(buffer, sizeof("00:00:00"), "%I:%M:%S", tick_time);
  }

  // Display this time on the TextLayer
  text_layer_set_text(text_layer, buffer);
}


void send_B() {
   DictionaryIterator* iter;
   AppMessageResult m_result = app_message_outbox_begin(&iter);
   
   while (m_result == APP_MSG_BUSY) {
      m_result = app_message_outbox_begin(&iter);
   }
   
   if(m_result == APP_MSG_OK && iter != NULL) {
      dict_write_cstring(iter, FUNC_DATA, "send_B");
      app_message_outbox_send();
   }
   else {
      APP_LOG(APP_LOG_LEVEL_ERROR, "send_B outbox_begin failed!");
   }
}
void send_heartbeat() {
   DictionaryIterator* iter;
   AppMessageResult m_result = app_message_outbox_begin(&iter);
   
   while (m_result == APP_MSG_BUSY) {
      m_result = app_message_outbox_begin(&iter);
   }
   
   if(m_result == APP_MSG_OK && iter != NULL) {
      dict_write_cstring(iter, FUNC_DATA, "send_heartbeat");
      app_message_outbox_send();
   }
   else {
      APP_LOG(APP_LOG_LEVEL_ERROR, "send_heartbeat outbox_begin failed!");
   }
}

void sent_B(char* B, char* salt) {
   DictionaryIterator* iter;
   AppMessageResult m_result = app_message_outbox_begin(&iter);
   
   while (m_result == APP_MSG_BUSY) {
      m_result = app_message_outbox_begin(&iter);
   }
   
   if(m_result == APP_MSG_OK && iter != NULL) {
      dict_write_cstring(iter, FUNC_DATA, "sent_B");
      dict_write_cstring(iter, B_DATA, B);
      dict_write_cstring(iter, SALT_DATA, salt);
      app_message_outbox_send();
   }
   else {
      APP_LOG(APP_LOG_LEVEL_ERROR, "sent_B outbox_begin failed!");
   }
}

void send_A(char* A) {
   DictionaryIterator* iter;
   AppMessageResult m_result = app_message_outbox_begin(&iter);
   
   while (m_result == APP_MSG_BUSY) {
      m_result = app_message_outbox_begin(&iter);
   }
   
   if(m_result == APP_MSG_OK && iter != NULL) {
      dict_write_cstring(iter, FUNC_DATA, "sent_A");
      dict_write_cstring(iter, A_DATA, A);
      app_message_outbox_send();
   }
   else {
      APP_LOG(APP_LOG_LEVEL_ERROR, "sent_A outbox_begin failed!");
   }
   
   // temp heartbeat test
   send_heartbeat();
}

void heartbeat() {
   DictionaryIterator* iter;
   AppMessageResult m_result = app_message_outbox_begin(&iter);
   char time_str[64];
   time_t temp_time = time(NULL);
   temp_time += 60*60*8;
   snprintf(time_str, sizeof(time_str), "%d", (int)temp_time);
   
   while (m_result == APP_MSG_BUSY) {
      m_result = app_message_outbox_begin(&iter);
   }
   
   if(m_result == APP_MSG_OK && iter != NULL) {
      dict_write_cstring(iter, FUNC_DATA, "heartbeat");
      dict_write_cstring(iter, TIME_DATA, time_str);
      app_message_outbox_send();
   }
   else {
      APP_LOG(APP_LOG_LEVEL_ERROR, "heartbeat outbox_begin failed!");
   }
}
void beat(char* beat) {
   DictionaryIterator* iter;
   AppMessageResult m_result = app_message_outbox_begin(&iter);
   
   while (m_result == APP_MSG_BUSY) {
      m_result = app_message_outbox_begin(&iter);
   }
   
   if(m_result == APP_MSG_OK && iter != NULL) {
      dict_write_cstring(iter, FUNC_DATA, "beat");
      dict_write_cstring(iter, BEAT_DATA, beat);
      app_message_outbox_send();
   }
   else {
      APP_LOG(APP_LOG_LEVEL_ERROR, "beat outbox_begin failed!");
   }
}

static void inbox_received_callback(DictionaryIterator *iterator, void *context) {
  // Get the first pair
  Tuple *t = dict_read_first(iterator);
  char func_name[64];
  char B_buffer[512];
  char A_buffer[512];
  char salt_buffer[64];
  char beat_buffer[128];
  time_t temp_time = time(NULL);
  struct tm *tick_time = localtime(&temp_time);

  // Process all pairs present
  while (t != NULL) {
    // Long lived buffer
    static char s_buffer[64];

    // Process this pair's key
    switch (t->key) {
      case FUNC_DATA:
        snprintf(s_buffer, sizeof(s_buffer), "Received '%s'", t->value->cstring);
        snprintf(func_name, sizeof(func_name), "%s", t->value->cstring);
        temp_time += 60*60*8;
        snprintf(s_buffer, sizeof(s_buffer), "%d", (int)temp_time);
        //strftime(s_buffer, sizeof("00/00/00 00:00:00"), "%D %H:%M:%S", tick_time);
        text_layer_set_text(text_layer, s_buffer);
        break;
      case B_DATA:
        snprintf(B_buffer, sizeof(B_buffer), "%s", t->value->cstring);
        break;
      case SALT_DATA:
        snprintf(salt_buffer, sizeof(salt_buffer), "%s", t->value->cstring);
        break;
      case A_DATA:
        snprintf(A_buffer, sizeof(A_buffer), "%s", t->value->cstring);
        break;
      case BEAT_DATA:
        snprintf(beat_buffer, sizeof(beat_buffer), "%s", t->value->cstring);
        break;
      default:
        snprintf(s_buffer, sizeof(s_buffer), "Received unknown: '%s'", t->value->cstring);
        text_layer_set_text(text_layer, s_buffer);
        break;
    }

    // Get next pair, if any
    t = dict_read_next(iterator);
  }
   
   if (!strcmp(func_name, "sent_B")) {  
      sent_B(B_buffer, salt_buffer);  
   }
   else if (!strcmp(func_name, "send_A")) {  
      send_A(A_buffer);  
   }
   else if (!strcmp(func_name, "heartbeat")) {  
      heartbeat();
   }
   else if (!strcmp(func_name, "beat")) {  
      beat(beat_buffer);
   }
   
}

static void inbox_dropped_callback(AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "Message dropped!");
}

static void outbox_failed_callback(DictionaryIterator *iterator, AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "Outbox send failed!");
}

static void outbox_sent_callback(DictionaryIterator *iterator, void *context) {
  APP_LOG(APP_LOG_LEVEL_INFO, "Outbox send success!");
}



static void main_window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);
  GRect window_bounds = layer_get_bounds(window_layer);

  // Create output TextLayer
  text_layer = text_layer_create(GRect(5, 0, window_bounds.size.w - 5, window_bounds.size.h));
  text_layer_set_font(text_layer, fonts_get_system_font(FONT_KEY_GOTHIC_24));
  text_layer_set_background_color(text_layer, GColorClear);
  text_layer_set_text_color(text_layer, GColorBlack);
  text_layer_set_text(text_layer, "PebbleLock on standby...");
  //text_layer_set_text(text_layer, "Waiting...");
  text_layer_set_overflow_mode(text_layer, GTextOverflowModeWordWrap);
   
  layer_add_child(window_layer, text_layer_get_layer(text_layer));
}

static void main_window_unload(Window *window) {
  // Destroy output TextLayer
  text_layer_destroy(text_layer);
}


void handle_init(void) {
   
   // Register callbacks
  app_message_register_inbox_received(inbox_received_callback);
  app_message_register_inbox_dropped(inbox_dropped_callback);
  app_message_register_outbox_failed(outbox_failed_callback);
  app_message_register_outbox_sent(outbox_sent_callback);

  // Open AppMessage
  app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());

   
  //tick_timer_service_subscribe(SECOND_UNIT, tick_handler);
  //tick_timer_service_subscribe(MINUTE_UNIT, tick_handler);
   
   my_window = window_create();
  window_set_window_handlers(my_window, (WindowHandlers) {
    .load = main_window_load,
    .unload = main_window_unload
  });
   
   
  window_stack_push(my_window, true);
   
   // Make sure the time is displayed from the start
   //update_time();
   
   // initiate a fake phone send B
   send_B();
}

void handle_deinit(void) {
  window_destroy(my_window);
}

int main(void) {
  handle_init();
  app_event_loop();
  handle_deinit();
}
