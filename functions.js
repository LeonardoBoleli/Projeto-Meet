async function buscaGrupos(){
    const grupos = await Grupo.findAll();
    strGrupos = JSON.stringify(grupos);
    console.log("strGrupos: " + typeof strGrupos);
    var jsonGrupos = JSON.parse(strGrupos);
    console.log("jsonGrupos: " + jsonGrupos[1]);
    var nomes = [];

    for (let i = 0; i < jsonGrupos.length; i++){
        nomes.push(jsonGrupos[i].nome_grupo);
    }

    console.log("NOMES: " + nomes);

    return [jsonGrupos.length, nomes];
}

export function buscaGrupos();