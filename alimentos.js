// Base de alimentos — valores aproximados por 100 g (ou 100 ml), inspirados na tabela TACO.
// Formato: [nome, kcal, proteína, carboidrato, gordura, porção em g, rótulo da porção]
const ALIMENTOS_BASE = [
  // Cereais, massas e pães
  ['Arroz branco cozido', 128, 2.5, 28.1, 0.2, 150, '1 escumadeira cheia'],
  ['Arroz integral cozido', 124, 2.6, 25.8, 1.0, 150, '1 escumadeira cheia'],
  ['Macarrão cozido', 102, 3.4, 19.9, 0.5, 200, '1 prato raso'],
  ['Cuscuz de milho cozido', 113, 2.2, 25.3, 0.7, 135, '1 fatia'],
  ['Tapioca (goma)', 240, 0, 60, 0, 60, '1 unidade média'],
  ['Aveia em flocos', 394, 13.9, 66.6, 8.5, 30, '2 colheres de sopa'],
  ['Granola', 421, 10, 64, 14, 40, '1/2 xícara'],
  ['Pão francês', 300, 8, 58.6, 3.1, 50, '1 unidade'],
  ['Pão de forma integral', 253, 9.4, 49.9, 3.7, 50, '2 fatias'],
  ['Pão de forma branco', 271, 8.3, 51, 3.4, 50, '2 fatias'],
  ['Pão de queijo', 363, 5.1, 34.2, 24.6, 40, '1 unidade média'],
  ['Biscoito cream cracker', 432, 10.1, 68.7, 14.4, 30, '5 unidades'],
  ['Biscoito recheado', 472, 6.4, 70.5, 19.6, 30, '3 unidades'],
  ['Bolo de chocolate', 410, 6.2, 54.7, 18.5, 60, '1 fatia'],

  // Leguminosas
  ['Feijão carioca cozido', 76, 4.8, 13.6, 0.5, 100, '1 concha'],
  ['Feijão preto cozido', 77, 4.5, 14, 0.5, 100, '1 concha'],
  ['Lentilha cozida', 93, 6.3, 16.3, 0.5, 100, '1 concha'],
  ['Grão-de-bico cozido', 164, 8.9, 27.4, 2.6, 100, '4 colheres de sopa'],

  // Carnes, aves, peixes e ovos
  ['Peito de frango grelhado', 159, 32, 0, 2.5, 120, '1 filé médio'],
  ['Coxa de frango assada', 215, 28.5, 0, 10.4, 100, '2 unidades'],
  ['Carne bovina grelhada (patinho)', 219, 35.9, 0, 7.3, 100, '1 bife médio'],
  ['Carne moída refogada', 212, 26.7, 0, 10.9, 100, '4 colheres de sopa'],
  ['Carne de porco (lombo) assada', 210, 35.7, 0, 6.4, 100, '1 fatia'],
  ['Linguiça grelhada', 296, 23, 0, 21.9, 60, '1 gomo'],
  ['Hambúrguer bovino grelhado', 210, 13.2, 11.3, 12.4, 80, '1 unidade'],
  ['Tilápia grelhada', 128, 26, 0, 2.7, 120, '1 filé'],
  ['Salmão grelhado', 229, 23.9, 0, 14, 120, '1 filé'],
  ['Atum em conserva', 166, 26.2, 0, 6, 60, '1/2 lata'],
  ['Ovo cozido', 146, 13.3, 0.6, 9.5, 50, '1 unidade'],
  ['Ovo frito', 240, 15.6, 1.2, 18.6, 50, '1 unidade'],
  ['Omelete simples', 170, 11, 1, 13.5, 100, '2 ovos'],
  ['Presunto', 94, 14.3, 2.1, 2.7, 30, '2 fatias'],

  // Laticínios
  ['Leite integral', 61, 3.2, 4.7, 3.3, 200, '1 copo'],
  ['Leite desnatado', 35, 3.4, 4.9, 0.1, 200, '1 copo'],
  ['Iogurte natural', 51, 4.1, 1.9, 3, 170, '1 pote'],
  ['Queijo minas frescal', 264, 17.4, 3.2, 20.2, 30, '1 fatia'],
  ['Queijo muçarela', 330, 22.6, 3, 25.2, 30, '2 fatias'],
  ['Requeijão cremoso', 257, 9.6, 2.4, 23.4, 30, '1 colher de sopa'],
  ['Manteiga', 726, 0.4, 0.1, 82.4, 10, '1 colher de chá'],
  ['Whey protein', 400, 80, 8, 6, 30, '1 dose'],

  // Tubérculos e legumes
  ['Batata inglesa cozida', 52, 1.2, 11.9, 0, 150, '1 unidade média'],
  ['Batata doce cozida', 77, 0.6, 18.4, 0.1, 150, '1 unidade média'],
  ['Batata frita', 267, 5, 35.6, 13.1, 100, '1 porção pequena'],
  ['Purê de batata', 108, 2, 15.5, 4.2, 120, '3 colheres de sopa'],
  ['Mandioca cozida', 125, 0.6, 30.1, 0.3, 100, '2 pedaços'],
  ['Alface', 11, 1.3, 1.7, 0.2, 40, '1 prato de sobremesa'],
  ['Tomate', 15, 1.1, 3.1, 0.2, 80, '1/2 unidade'],
  ['Cenoura crua', 34, 1.3, 7.7, 0.2, 60, '1/2 unidade'],
  ['Brócolis cozido', 25, 2.1, 4.4, 0.5, 80, '3 ramos'],
  ['Abobrinha refogada', 24, 1.1, 4.2, 0.8, 80, '3 colheres de sopa'],
  ['Milho verde cozido', 98, 3.2, 17.1, 2.4, 100, '1 espiga'],

  // Frutas
  ['Banana prata', 98, 1.3, 26, 0.1, 70, '1 unidade'],
  ['Maçã', 56, 0.3, 15.2, 0, 130, '1 unidade'],
  ['Laranja', 46, 1, 11.5, 0.1, 180, '1 unidade'],
  ['Mamão papaia', 40, 0.5, 10.4, 0.1, 150, '1/2 unidade'],
  ['Manga', 64, 0.4, 16.7, 0.3, 140, '1/2 unidade'],
  ['Abacate', 96, 1.2, 6, 8.4, 100, '4 colheres de sopa'],
  ['Abacaxi', 48, 0.9, 12.3, 0.1, 100, '1 fatia'],
  ['Melancia', 33, 0.9, 8.1, 0, 200, '1 fatia'],
  ['Morango', 30, 0.9, 6.8, 0.3, 120, '10 unidades'],
  ['Uva', 53, 0.7, 13.6, 0.2, 100, '1 cacho pequeno'],
  ['Açaí (polpa adoçada)', 110, 0.7, 21.5, 3.7, 200, '1 tigela pequena'],

  // Óleos, oleaginosas e doces
  ['Azeite de oliva', 884, 0, 0, 100, 13, '1 colher de sopa'],
  ['Amendoim torrado', 606, 22.5, 18.7, 54, 30, '1 punhado'],
  ['Pasta de amendoim', 593, 25, 20, 50, 15, '1 colher de sopa'],
  ['Castanha-do-pará', 643, 14.5, 15.1, 63.5, 12, '3 unidades'],
  ['Castanha de caju', 570, 18.5, 29.1, 46.3, 30, '1 punhado'],
  ['Açúcar', 387, 0, 99.5, 0, 5, '1 colher de chá'],
  ['Mel', 309, 0, 84, 0, 20, '1 colher de sopa'],
  ['Chocolate ao leite', 540, 7.2, 59.6, 30.3, 25, '1 barra pequena'],
  ['Doce de leite', 306, 5.5, 59.5, 6, 20, '1 colher de sopa'],
  ['Sorvete de creme', 207, 3.5, 23.6, 11, 60, '1 bola'],

  // Lanches e pratos
  ['Pizza de muçarela', 250, 11, 30, 10, 120, '1 fatia'],
  ['Coxinha de frango', 283, 9.6, 34.5, 11.8, 80, '1 unidade'],
  ['Pastel de carne frito', 388, 10.1, 43.8, 20.1, 80, '1 unidade'],
  ['Misto quente', 265, 13, 27, 11.5, 100, '1 unidade'],
  ['Strogonoff de frango', 157, 13.5, 4, 9.8, 150, '1 concha grande'],
  ['Feijoada', 117, 8.7, 11.6, 6.5, 250, '1 prato fundo'],
  ['Lasanha à bolonhesa', 150, 8, 14, 7, 250, '1 pedaço'],

  // Bebidas
  ['Café sem açúcar', 2, 0.1, 0.3, 0, 100, '1 xícara'],
  ['Suco de laranja natural', 41, 0.7, 9.6, 0.1, 250, '1 copo'],
  ['Refrigerante de cola', 37, 0, 9.5, 0, 350, '1 lata'],
  ['Água de coco', 22, 0, 5.3, 0, 300, '1 copo grande'],
  ['Cerveja', 41, 0.6, 3.3, 0, 350, '1 lata'],
  ['Vinho tinto', 85, 0.1, 2.6, 0, 150, '1 taça'],
].map(([nome, kcal, p, c, g, porcao, rotulo]) => ({ nome, kcal, p, c, g, porcao, rotulo }));
