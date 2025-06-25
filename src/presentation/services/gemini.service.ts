import { GoogleGenerativeAI } from "@google/generative-ai";
import { envs } from "../../config/envs.js";
import { CustomError } from "../../domain/CustomError.js";
import { GoogleGenAI, Type } from "@google/genai";
import { text } from "stream/consumers";
import { config } from "dotenv";



const registrarGastoFunctionDeclaration = {
  name: "RegistrarGasto",
  description: "Registra un gasto para el usuario, registrando el nombre del gasto, la cantidad total a pagar, la fecha de emisión y opcionalmente los productos adquiridos.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      nombreGasto: {
        type: Type.STRING,
        description: "Nombre del gasto realizado. Ejemplo: 'Pago de electricidad', 'Compra de supermercado'."
      },
      cantidadTotal: {
        type: Type.NUMBER,
        description: "Cantidad total a pagar por el gasto."
      },
      fechaEmision: {
        type: Type.STRING,
        format: "date-time",
        description: "Fecha de emisión del gasto en formato YYYY-MM-DD."
      },
      productosAdquiridos: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING
        },
        description: "Lista opcional de productos adquiridos en el gasto."
      }
    },
    required: ["nombreGasto", "cantidadTotal"]
  }
}

export class GeminiService {

  static modelosSoportados = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-pro-preview-05-20"];

  static chatObj: any = null;

  static ask = async (prompt: string, modelo: string = this.modelosSoportados[0]): Promise<string> => {

    modelo = modelo.trim();

    if (!this.modelosSoportados.includes(modelo)) {
      throw new CustomError(
        "Modelo no soportado, los modelos soportados son: " +
        this.modelosSoportados.toString(),
        400
      );
    }

    try {

      const response = await this.generateContent(prompt, modelo);

      const text = response.text;

      return text!;
    } catch (error: Error | any) {
      console.log(error);
      throw new CustomError(
        "Error al procesar la solicitud a Gemini: " + error.message,
        500
      );
    }
  };


  static generateContent = async (prompt: string, modelo: string = this.modelosSoportados[0]) => {

    const ai = new GoogleGenAI({ apiKey: envs.GEMINI_API_KEY });

    let response = await ai.models.generateContent({
      model: modelo.trim(),
      contents: prompt,
      // Removed tools config since it's not being used and was causing the error
    });

    return response;

  }


  static chat = async (prompt: string, modelo: string = this.modelosSoportados[0]): Promise<string> => {

    modelo = modelo.trim();

    if (!this.modelosSoportados.includes(modelo)) {
      throw new CustomError(
        "Modelo no soportado, los modelos soportados son: " +
        this.modelosSoportados.toString(),
        400
      );
    }

    try {

      console.log("chatObj:", this.chatObj);
      if (!this.chatObj) {


        await this.generateContentChat(prompt, modelo);
      }

      const response = await this.chatObj.sendMessage({ message: prompt });

      //si el modelo decide , llamar a una funcion, la respuesta vendra en el campo functionCalls
      if (response.functionCalls && response.functionCalls.length > 0) {

        const functionCall = response.functionCalls[0]; // botenemos el funcionCall de la respuesta de la ia
        console.log(`Function to call: ${functionCall.name}`);
        console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);

        let result;


        if (functionCall.name === "GetParadasCercanas") {



          return "Hola, me gutaria ayudarte, pero no tengo acceso directo a tu ubicacion, puedes consultarlas en Ver Cercanas, busca el icono del autobus en la parte inferior derecha de la pantalla, y selecciona la opcion de ver cercanas, y te mostrara las paradas mas cercanas a tu ubicacion actual, si no tienes acceso a esa funcion, por favor contacta a soporte técnico."
        }
        if (functionCall.name === "GetBusesMasVacios") {
          //TODO: traer buses mas vacios
          return "Hola, me gutaria ayudarte, pero no tengo acceso a esa informacion por el momento, por favor contacta a soporte técnico."


        }
        if (functionCall.name === "GetServicios") {
          return "Hola, los servicios ofrecidos por los buses en Santa Ana, no son muy variados, la mayoria ofrecen aire acondicionado unicamente como servicio extra\nBuses Regulares: No ofrecen servicios adicionales, ademas del transporte\nBuses Especiales: Ofrecen aire acondicionado y television (en algunos casos)\nLas rutas que ofrecen servicios exclusivos mas variados son las interdepartamentales que salen y entran a Santa Ana como 201, SEISABUS o 202"
        }





      }

      //si el modelo no decide llamar a una funcion, entonces la respuesta vendra del modelo
      const text = await response.text;

      return text!;
    } catch (error: Error | any) {
      console.log(error);
      throw new CustomError(
        "Error al procesar la solicitud a Gemini: " + error.message,
        500
      );
    }
  };



  static generateContentChat = async (prompt: string, modelo: string = this.modelosSoportados[0]) => {


    const promptDefault = ',Eres un asistende de IA, sobre la app Busroutes Mobile, que ayuda a los usuarios a encontrar informacion sobre transporte publico salvadoreño, servicios, seguridad en el transporte, tambien puedes ayudar sobre como actuar en ciertas situaciones, toda informacion esta en el contexto de El Salvador,  aparte si algun usuario hace alguna pregunta no relacionada con el tema (transporte, leyes, seguridad vial etc), responde con "Lo siento, no puedo ayudar con cosas no relacionadas al transporte publico",(aunque puedes se flexible si la pregunta se relaciona a transporte en general, leyes de el salvador de transporte, sanciones y otros temas de alguna forma relacionados, incluso situaciones de peligro en transporte publico, tambien puedes ser flexible si la pregunta se relaciona de alguna manera con los mensajes anteriores del chat  ) ademas evita responder a palabras ofensivas o temas como politica o religion, NO MENCIONES COSAS TECNIAS SOBRE LA APP COMO API, NI MENCIONES NADA SOBRE FUNCIONES, API O CODIGO INTERNO DEL SISTEMA NI NADA DE LOS FUNCTION CALLS QUE TIENES como `default_api.GetRutas() etc. UTILIZA LOS MENSAJES ANTERIORES DEL CHAT COMO CONTEXTO TAMBIEN';
    const ai = new GoogleGenAI({ apiKey: envs.GEMINI_API_KEY });

    let chat = await ai.chats.create({
      model: modelo.trim(),
      history: [
        {
          role: "user",
          parts: [{ text: "Hello" }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],

      config: {
        tools: [{
          // functionDeclarations: [registrarGastoFunctionDeclaration], //especificamos las funciones que queremos que el modelo use
        }],
        systemInstruction: promptDefault
      },

    });

    console.log("chat creado:", chat);
    this.chatObj = chat;
    console.log("chatObj de clase=====>:", this.chatObj);

  }


  static describeAudioFromUrl = async (base64Audio: string, mimeType: string, modelo: string = this.modelosSoportados[0]): Promise<string> => {
    try {
      const ai = new GoogleGenAI({ apiKey: envs.GEMINI_API_KEY });

      // Descarga el archivo de audio desde la URL y súbelo a Gemini

      const contents = [

        {
          inlineData: {
            mimeType: "audio/mp3",
            data: base64Audio,
          },
        },
      ];

      const response = await ai.models.generateContent({
        model: modelo.trim(),
        contents: contents,
        config: {
          tools: [{ functionDeclarations: [registrarGastoFunctionDeclaration] }],
        }
      });
      if (response.functionCalls && response.functionCalls.length > 0) {

        console.log("Response with function calls:");
        const functionCall = response.functionCalls[0]; // botenemos el funcionCall de la respuesta de la ia

        if (functionCall.name === "RegistrarGasto") {
          console.log(`Function to call: ${functionCall.name}`);
          if (functionCall.args) {
            const { nombreGasto, cantidadTotal, fechaEmision } = functionCall.args as { nombreGasto?: string, cantidadTotal?: number, fechaEmision?: string };
            return `Gasto registrado exitosamente.\nNombre del gasto: ${nombreGasto}\nCantidad total: ${cantidadTotal}\nFecha de emisión: ${fechaEmision}`;
          } else {
            return "No se pudieron obtener los detalles del gasto desde la respuesta.";
          }
        }



      }

      return response.text!;
    } catch (error: Error | any) {
      console.log(error);
      throw new CustomError(
        "Error al procesar la solicitud de descripción de audio: " + error.message,
        500
      );
    }
  };

  static describeImageFromUrl = async (base64Image: string, mimeType: string, prompt: string, modelo: string = this.modelosSoportados[0]): Promise<string> => {

    const ai = new GoogleGenAI({ apiKey: envs.GEMINI_API_KEY });

    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },


      },

    ];

    const response = await ai.models.generateContent({
      model: modelo.trim(),
      contents: contents,
      config: {
        tools: [{ functionDeclarations: [registrarGastoFunctionDeclaration] }],
      }
    });

    if (response.functionCalls && response.functionCalls.length > 0) {

      console.log("Response with function calls:");
      const functionCall = response.functionCalls[0]; // botenemos el funcionCall de la respuesta de la ia

      if (functionCall.name === "RegistrarGasto") {
        console.log(`Function to call: ${functionCall.name}`);
        if (functionCall.args) {
          const { nombreGasto, cantidadTotal, fechaEmision } = functionCall.args as { nombreGasto?: string, cantidadTotal?: number, fechaEmision?: string };
          return `Gasto registrado exitosamente.\nNombre del gasto: ${nombreGasto}\nCantidad total: ${cantidadTotal}\nFecha de emisión: ${fechaEmision}`;
        } else {
          return "No se pudieron obtener los detalles del gasto desde la respuesta.";
        }
      }



    }

    console.log(response.text);
    return response.text || "No description available.";
  }

}



