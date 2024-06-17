import os
import json
import re
from lxml import etree

def clean_text(text):
    """Helper function to clean text by removing extra whitespace and newlines."""
    if text:
        return ' '.join(text.split())
    else:
        return ''

def extract_text(element):
    """Extract text from an XML element, including nested elements."""
    if element is None:
        return ''
    return ''.join(element.itertext())

def extract_entities(root, tag_name):
    """Extract entities (lugares, datas, entidades) from XML and return a set."""
    entities_set = set()
    entities = root.findall(f'.//{tag_name}')
    for entity in entities:
        # Clean and normalize text to contain letters, numbers, and spaces
        entity_text = re.sub(r'[^\w\s]', '', clean_text(etree.tostring(entity, method='text', encoding='unicode', with_tail=False).strip()))
        if entity_text:
            entities_set.add(entity_text)
    return entities_set

def process_xml(xml_file, ruas_data):
    """Process each XML file and aggregate data into `ruas_data`."""
    # Parse the XML file
    tree = etree.parse(xml_file)
    root = tree.getroot()

    # Extract '_id' (numero da rua), 'nome'
    numero = root.findtext('meta/número')
    nome = clean_text(root.findtext('meta/nome'))  # Extracting 'nome' and cleaning text

    # Extract 'figuras'
    figuras = []
    for figura in root.findall('corpo/figura'):
        figura_dict = {
            "id": figura.get('id'),
            "imagem": figura.find('imagem').get('path'),
            "legenda": clean_text(figura.findtext('legenda'))
        }
        figuras.append(figura_dict)
    
    # Extract 'para'
    para = []
    for p in root.findall('corpo/para'):
        para_text = clean_text(etree.tostring(p, method='text', encoding='unicode', with_tail=False).strip())
        para.append(para_text)

    # Extract 'casas'
    casas = []
    for casa in root.findall('corpo/lista-casas/casa'):
        casa_dict = {
            "número": casa.findtext('número'),
            "enfiteuta": casa.findtext('enfiteuta'),
            "foro": casa.findtext('foro'),
            "desc": clean_text(extract_text(casa.find('desc/para')))  # Handle potential NoneType
        }
        casas.append(casa_dict)
    
    # Extract <lugar>, <data>, <entidade> allowing letters, numbers, and spaces
    lugares = extract_entities(root, 'lugar')
    datas = extract_entities(root, 'data')
    entidades = extract_entities(root, 'entidade')

    # Prepare rua data
    rua_data = {
        "_id": int(numero),  # Usando numero como _id
        "nome": nome,
        "figuras": figuras,
        "para": para,
        "casas": casas,
        "lugares": list(lugares),
        "datas": list(datas),
        "entidades": list(entidades)
    }

    ruas_data.append(rua_data)

def add_figuras_to_ruas(input_folder, ruas_data):
    """Add figuras to respective ruas based on filenames in input_folder."""
    # Regex pattern to match the initial number in filenames (e.g., "1-RuadoCampo-Vista1")
    filename_pattern = r'^(\d+)-'

    for rua in ruas_data:
        _id = rua['_id']
        figuras = []

        for filename in os.listdir(input_folder):
            if filename.endswith('.JPG'):  # Adjust file extensions as needed
                match = re.match(filename_pattern, filename)
                if match:
                    numero_from_filename = int(match.group(1))
                    if numero_from_filename == _id:
                        # Construct legenda based on street name and last part of filename
                        street_name = rua['nome']
                        filename_parts = filename.split('-')
                        last_filename_part = filename_parts[-1].split('.')[0]  # Remove extension
                        legenda = f"{street_name} - {last_filename_part}"
                        
                        figuras.append({
                            "imagem": f'../atual/{filename}',
                            "legenda": legenda
                        })
        
        # Sort figuras alphabetically by legenda
        figuras.sort(key=lambda x: x['legenda'])

        # Add sorted figuras to rua['figuras']
        rua['figuras'] += figuras

def main(input_folder, output_json):
    """Main function to process all XML files in the input folder."""
    ruas_data = []

    # Process each XML file in the input folder
    for filename in os.listdir(input_folder):
        if filename.endswith('.xml'):
            xml_file = os.path.join(input_folder, filename)
            process_xml(xml_file, ruas_data)
    
    # Add figuras to respective ruas based on filenames
    add_figuras_to_ruas('Interface/public/atual', ruas_data)
    
    # Write to JSON file
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(ruas_data, f, ensure_ascii=False, indent=4)



input_folder = 'DATASET/dataset/texto'
output_json = 'DATASET/dataset/ruasBraga.json'
main(input_folder, output_json)
