//! Workflow Recorder crate for Windows
//!
//! This crate provides functionality to record user interactions with the Windows UI,
//! including mouse clicks, keyboard input, and window focus changes.
//! The recorded workflow can be saved as a JSON file for later playback or analysis.

#![cfg_attr(not(target_os = "windows"), allow(unused))]

pub mod error;
pub mod events;
pub mod recorder;

pub use error::*;
pub use events::{
    ApplicationSwitchEvent, ApplicationSwitchMethod, BrowserTabNavigationEvent, ClipboardAction,
    ClipboardEvent, DragDropEvent, EventMetadata, HotkeyEvent, KeyboardEvent, MouseButton,
    MouseEvent, MouseEventType, Position, RecordedEvent, RecordedWorkflow, Rect, SelectionMethod,
    StructureChangeType, TabAction, TabNavigationMethod, TextInputCompletedEvent, TextInputMethod,
    TextSelectionEvent, UiFocusChangedEvent, UiPropertyChangedEvent, UiStructureChangedEvent,
    WorkflowEvent,
};
pub use recorder::*;
