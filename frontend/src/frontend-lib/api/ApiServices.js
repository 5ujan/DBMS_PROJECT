import axios from "axios";

class ApiServices {
    constructor() {
        this.api = axios.create({
            headers: {
                "Content-Type": "application/json",
            },
            baseURL:"http://localhost:5555/api"
        });

        // Add interceptor for auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("token");
                if (token) {
                    config.headers["Authorization"] = `${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    // Authentication
    async login(payload) {
        try {
            const { data, status } = await this.api.post("/login", payload);
            if (status === 200) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                return true;
            }
            return "Login failed";
        } catch (error) {
            return error.message;
        }
    }

    async register(payload) {
        try {
            const { data, status } = await this.api.post("/register", payload);
            if (status === 201 && data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                return true;
            }
            return false;
        } catch (error) {
            return error.message;
        }
    }

    async getUser() {
        console.log("getusercalled")
        try {
            const { data, status } = await this.api.get("/user");
            console.log({data})
            if (status === 200) {
                return data;
            }
            return "Failed to fetch user data";
        } catch (error) {
            return error.message;
        }
    }

    async updateUserData(payload) {
        try {
            console.log({unformated:payload})
          const formattedPayload = this.formatPayload(payload);
          console.log({formattedPayload})
          const { data, status } = await this.api.post("/user", formattedPayload);
          console.log({data})
          return { data, status };
        } catch (error) {
          console.error("Error updating user data:", error);
          return false;
        }
      }
      
       formatPayload(payload) {
        if (payload.role === "volunteer") {
          return {
            ...payload,
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            gender: payload.gender,
            dob: payload.dob.split("T")[0],
            skills: payload.skills || [],
            avatar: payload.avatar,
            created_at: payload.created_at.split("T")[0],

          };
        } else if (payload.role === "organization") {
          return {
            ...payload,
            organization_name: payload.name,
            email: payload.email,
            contact_phone: payload.phone,
            contact_email: payload.email,
            avatar: payload.avatar,
            created_at: payload.created_at?.split("T")[0],
            established_date: payload.established_date.split("T")[0],
          };
        }
        console.log(payload)
        return payload;
      }
      

    // Events
    async getAllEvents() {
        try {
            const { data, status } = await this.api.get("/event");
            if (status === 200) {
                return data;
            }
            return "Failed to fetch events";
        } catch (error) {
            return error.message;
        }
    }

    async getEventById(id) {
        try {
            const { data, status } = await this.api.get(`/event/${id}`);
            if (status === 200) {
                return data;
            }
            return "Failed to fetch event";
        } catch (error) {
            return error.message;
        }
    }

    async createEvent(data) {
        try {
            const { data: eventData, status } = await this.api.post("/event", data);
            if (status === 201) {
                return eventData;
            }
            return "Failed to create event";
        } catch (error) {
            return error.message;
        }
    }

    async updateEvent(id, data) {
        try {
            const { data: eventData, status } = await this.api.put(`/event/${id}`, data);
            if (status === 200) {
                return eventData;
            }
            return "Failed to update event";
        } catch (error) {
            return error.message;
        }
    }

    async deleteEvent(id) {
        try {
            const { status } = await this.api.delete(`/event/${id}`);
            if (status === 200) {
                return "Event deleted successfully";
            }
            return "Failed to delete event";
        } catch (error) {
            return error.message;
        }
    }

    async registerVolunteer(eventId) {
        try {
            const { status } = await this.api.post(`/event/${eventId}/register`);
            if (status === 200) {
                return "Volunteer registered successfully";
            }
            return "Failed to register volunteer";
        } catch (error) {
            return error.message;
        }
    }

    async getAllSkills() {
        try {
            const { data, status } = await this.api.get("/skills");
            if (status === 200) {
                return data;
            }
            return "Failed to fetch skills";
        } catch (error) {
            return error.message;
        }
    }

    async getSkillsByVolunteerId(volunteerId) {
        try {
            const { data, status } = await this.api.get(`/volunteer/${volunteerId}/skills`);
            if (status === 200) {
                return data;
            }
            return "Failed to fetch skills for this volunteer";
        } catch (error) {
            return error.message;
        }
    }

    async addSkillToVolunteer(payload) {
        try {
            const { data, status } = await this.api.post("/volunteer/skill", payload);
            if (status === 201) {
                return data;
            }
            return "Failed to add skill to volunteer";
        } catch (error) {
            return error.message;
        }
    }

    async removeSkillFromVolunteer(volunteerId, skillId) {
        try {
            const { status } = await this.api.delete(`/volunteer/${volunteerId}/skill/${skillId}`);
            if (status === 200) {
                return "Skill removed successfully";
            }
            return "Failed to remove skill";
        } catch (error) {
            return error.message;
        }
    }

    async uploadPhotoToCloudinary(file) {
        try {
            const formData = new FormData();
            formData.append("photo", file);
    
            const { data, status } = await this.api.post("/image/getUrl", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (status < 400) {
                return data; // Returns Cloudinary image URL
            }
            return "Failed to upload image";
        } catch (error) {
            return error.message;
        }
    }
    async adminGetStats() {
        try {
            const { data, status } = await this.api.get("/admin/stats");
            if (status === 200) {
                return data;
            }
            return "Failed to fetch stats";
        } catch (error) {
            return error.message;
        }
    }
    async  adminGetAllOrganizations() {
        try {
            const { data, status } = await this.api.get("/admin/organization");
            if (status === 200) {
                return data;
            }
            return "Failed to fetch organizations";
        } catch (error) {
            return error.message;
        }
    }
    async  adminGetAllVolunteers() {
        try {
            const { data, status } = await this.api.get("/admin/volunteer");
            if (status === 200) {
                return data;
            }
            return "Failed to fetch volunteers";
        } catch (error) {
            return false
        }
    }
    async  adminGetAllEvents() {
        try {
            const { data, status } = await this.api.get("/admin/event");
            if (status === 200) {
                return data;
            }
            return "Failed to fetch events";
        } catch (error) {
            return false;
        }
    }
    async  adminDeleteEvent(id) {
        try {
            const { status } = await this.api.delete(`/admin/event/${id}`);
            if (status === 200) {
                return "Event deleted successfully";
            }
            return "Failed to delete event";
        } catch (error) {
            return false;
        }
    }
    async  adminDeleteOrganization(id) {
        try {
            const { status } = await this.api.delete(`/admin/organization/${id}`);
            if (status === 200) {
                return "Organization deleted successfully";
            }
            return "Failed to delete organization";
        } catch (error) {
            return false;
        }
    }
    async  adminDeleteVolunteer(id) {
        try {
            const { status } = await this.api.delete(`/admin/volunteer/${id}`);
            if (status === 200) {
                return "Volunteer deleted successfully";
            }
            return "Failed to delete volunteer";
        } catch (error) {
            return false;
        }
    }
    async updateUserRole(email, promote = true) {
        try {
            const { status } = await this.api.post("/admin/update_user_role", {
                email,
                promote
            });
            if (status === 200) {
                return "Role updated successfully";
            }
            return "Failed to update role";
        } catch (error) {
            return false;
        }
    }

    // Logout method
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
}

export default new ApiServices();
