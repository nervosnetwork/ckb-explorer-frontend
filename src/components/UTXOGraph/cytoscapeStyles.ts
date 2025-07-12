import { StylesheetStyle } from 'cytoscape'

export const cytoscapeStyles: StylesheetStyle[] = [
  {
    selector: 'core',
    style: {
      'active-bg-color': '#f9f9f9',
      'active-bg-size': 0,
      'active-bg-opacity': 0,
      'selection-box-color': '#f9f9f9',
      'selection-box-border-width': 0,
      'selection-box-opacity': 0,
      'selection-box-border-color': '#f9f9f9',
      'outside-texture-bg-color': '#f9f9f9',
      'outside-texture-bg-opacity': 0,
    },
  },
  {
    selector: 'node',
    style: {
      width: 200,
      height: 90,
      'border-width': 0,
      'background-color': '#f9f9f9',
      'overlay-opacity': 0,
      content: '',
      opacity: 0,
    },
  },
  {
    selector: 'edge',
    style: {
      width: 1,
      'line-color': '#ccc',
      'mid-target-arrow-color': '#ccc',
      'mid-target-arrow-shape': 'triangle',
      'overlay-opacity': 0,
    },
  },
]
