// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use std::time::SystemTime;

#[derive(Debug, Serialize, Deserialize)]
struct FileEntry {
    name: String,
    path: String,
    is_dir: bool,
    size: u64,
    modified: u64,
}

#[derive(Debug, Serialize, Deserialize)]
struct ReadDirectoryOptions {
    show_hidden: Option<bool>,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn read_directory(
    path: String,
    options: Option<ReadDirectoryOptions>,
) -> Result<Vec<FileEntry>, String> {
    let dir_path = Path::new(&path);
    
    // Check if the path exists and is a directory
    if !dir_path.exists() {
        return Err(format!("Directory does not exist: {}", path));
    }
    
    if !dir_path.is_dir() {
        return Err(format!("Path is not a directory: {}", path));
    }
    
    // Read directory contents
    let entries = match fs::read_dir(dir_path) {
        Ok(entries) => entries,
        Err(e) => {
            return Err(format!("Failed to read directory: {}", e));
        }
    };
    
    let show_hidden = options
        .as_ref()
        .and_then(|opts| opts.show_hidden)
        .unwrap_or(false);
    
    let mut file_entries: Vec<FileEntry> = Vec::new();
    
    for entry in entries {
        let entry = match entry {
            Ok(e) => e,
            Err(e) => {
                eprintln!("Error reading entry: {}", e);
                continue;
            }
        };
        
        let file_name = entry.file_name();
        let file_name_str = file_name.to_string_lossy().to_string();
        
        // Skip hidden files if not requested
        if !show_hidden && file_name_str.starts_with('.') {
            continue;
        }
        
        let metadata = match entry.metadata() {
            Ok(m) => m,
            Err(e) => {
                eprintln!("Error reading metadata for {}: {}", file_name_str, e);
                continue;
            }
        };
        
        let modified = metadata
            .modified()
            .unwrap_or(SystemTime::UNIX_EPOCH)
            .duration_since(SystemTime::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs();
        
        file_entries.push(FileEntry {
            name: file_name_str,
            path: entry.path().to_string_lossy().to_string(),
            is_dir: metadata.is_dir(),
            size: metadata.len(),
            modified,
        });
    }
    
    // Sort: directories first, then files, both alphabetically
    file_entries.sort_by(|a, b| {
        match (a.is_dir, b.is_dir) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
        }
    });
    
    Ok(file_entries)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![read_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn main() {
    run();
}