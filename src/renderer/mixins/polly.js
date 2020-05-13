/*------------------------------------
----------- Polly Controller -----------
-------------------------------------*/
import Ros from "@/mixins/ros.js";

export default {
    // mixins: [Ros],
    data() {
        return {
            action_polly: {
                goal: {  
                    nombreArchivo: "",
                    texto: "",
                    funcion: 0,
                },
                feedback: {  
                    time_elapsed: 0
                },
                result: { 
                    success: null,
                },
                status: { 
                    status: 0, text: '' 
                },
            }
        }
    },
    methods: {
        
    }
}