/**
 * Text Rotation Configuration
 * 
 * This file contains all the configuration for rotating text sections.
 * You can easily add, remove, or modify the rotation items here.
 * 
 * Structure:
 * - rotationSets contains different sets of sections that will rotate
 * - Each rotation set contains an array of objects with title and content
 * - Rotation interval is set in milliseconds (5000ms = 5 seconds)
 */

const rotationConfig = {
  // Rotation interval in milliseconds (5 seconds)
  interval: 5000,
  
  // Rotation sets for each position in the metadata
  rotationSets: {
    // First position (previously 'Medium')
    position1: [
      { title: 'Medium', content: 'Acoustic / Electronic / Tape' },
      { title: 'Channels', content: 'Piano / Ensembles / Machines' },
      { title: 'Core', content: 'Melancholic / Experimental' },
      { title: 'Heritage', content: 'Classical / Electronic' }
    ],
    
    // Second position (previously 'Notation')
    position2: [
      { title: 'Notation', content: 'Traditional / MIDI' },
      { title: 'Input', content: 'Line / Mic' },
      { title: 'Output', content: 'Minimal / Complex' },
      { title: 'Technique', content: 'Polyphonic / Textural' }
    ],
    
    // Third position (previously 'Duration')
    position3: [
      { title: 'Duration', content: 'Variable / Custom / Eternal' },
      { title: 'Form', content: 'Abstract / Structured' },
      { title: 'Time', content: 'Fluid / Static' },
      { title: 'Scale', content: 'Intimate / Expansive' }
    ],
    
    // Fourth position (previously 'Commissioned by')
    position4: [
      { title: 'Commissioned By', content: 'El Deseo, Coca-Cola,<br>Mccann Erickson, Ogilvy,<br>Festival BAM' },
      { title: 'Awards & Nominations', content: 'Goya, León de Cannes,<br>Festival de Cine de Gijón,<br>Festival de Ciudad Rodrigo' },
      { title: 'Referents', content: 'Johann Johannssonn, Max Richter,<br>Steve Reich, Philip Glass,<br>Arvo Pärt, William Basinski'},
      { title: 'Influence', content: 'Boards of Canada, Aphex Twin,<br>Moderat, Radiohead, Merzbow,<br>Ryuichi Sakamoto, Fennesz' }
    ]
  }
};

// Export the configuration for use in rotation scripts
export default rotationConfig;
