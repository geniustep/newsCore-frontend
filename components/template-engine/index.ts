/**
 * NewsCore Template Engine - Components Index
 * فهرس مكونات محرك القوالب
 */

// Main Renderers
export { TemplateRenderer, default as TemplateRendererDefault } from './TemplateRenderer';
export { SectionRenderer, default as SectionRendererDefault } from './SectionRenderer';
export { BlockRenderer, default as BlockRendererDefault } from './BlockRenderer';

// Re-export types
export type { 
  Template,
  Section,
  Block,
  BlockType,
  BlockConfig,
  DataSource,
  TemplateType,
  LayoutType,
} from '@/lib/template-engine/types';
