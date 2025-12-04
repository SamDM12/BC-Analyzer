import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre del rol es requerido"],
        unique: true,
        trim: true,
        uppercase: true
    },
    description: {
        type: String,
        default: ""
    },
    permissions: [
        {
            type: String,
            required: true
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Índice por nombre para búsquedas y unicidad
roleSchema.index({ name: 1 }, { unique: true });

const Role = mongoose.model("Role", roleSchema);
export default Role;