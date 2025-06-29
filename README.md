# 🌸 FloraGrade - AI-Powered Flower E-Commerce Platform

FloraGrade is a comprehensive e-commerce platform that combines AI-powered flower quality assessment with a modern marketplace. The platform ensures only the highest quality flowers (Grade A and B) are available for sale, providing customers with premium products and sellers with quality assurance.

## 🚀 Features

### 🤖 AI-Powered Flower Grading
- **Computer Vision Analysis**: Advanced CNN model for flower quality assessment
- **Multi-Metric Evaluation**: Color vibrancy, symmetry, damage detection, and shape uniformity
- **Automatic Grading**: Real-time A, B, or C grade classification
- **Quality Assurance**: Only Grade A and B flowers are approved for sale

### 👥 Multi-Role User System
- **Customers**: Browse and purchase premium flowers
- **Sellers**: Upload flowers with automatic AI grading
- **Admins**: Comprehensive platform management

### 🛒 E-Commerce Features
- **Product Management**: Full CRUD operations for flower products
- **Shopping Cart**: Add, remove, and manage items
- **Order Management**: Complete order lifecycle tracking
- **User Authentication**: Secure login/registration system

### 📊 Admin Dashboard
- **Analytics**: Revenue tracking, user statistics, product metrics
- **User Management**: Add, update, and remove users
- **Product Approval**: Review and approve/reject flower submissions
- **Order Management**: Track and manage all orders

## 🏗️ Architecture

### Backend (FastAPI + SQLAlchemy)
- **MVC Pattern**: Clean separation of concerns
- **RESTful API**: Comprehensive endpoints for all operations
- **JWT Authentication**: Secure token-based authentication
- **SQLite Database**: Lightweight and efficient data storage
- **File Upload**: Image handling for flower submissions

### Frontend (React + Tailwind CSS)
- **Modern UI**: Beautiful, responsive design
- **Component-Based**: Reusable and maintainable components
- **State Management**: Efficient data flow
- **Routing**: Seamless navigation between pages

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation using Python type annotations
- **JWT**: JSON Web Token authentication
- **Pillow**: Image processing
- **OpenCV**: Computer vision operations
- **PyTorch**: Deep learning for flower grading

### Frontend
- **React**: JavaScript library for building user interfaces
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FloraGrade/backend
   ```

2. **Run the setup script**
   ```bash
   python setup.py
   ```

3. **Start the backend server**
   ```bash
   python main.py
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## 🔐 Default Credentials

### Admin Access
- **Email**: admin@floragrade.com
- **Password**: admin123

### Demo Users
- **Seller**: seller / password123
- **Customer**: customer / password123

## 📋 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/token` - User login
- `GET /auth/me` - Get current user profile

### Products
- `GET /products` - List all products
- `POST /products` - Create new product (seller only)
- `GET /products/{id}` - Get product details
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Flower Grading
- `POST /flower-api/grade-flower` - Grade flower image
- `POST /flower-api/download-report` - Download grading report

### Admin
- `GET /admin/dashboard/stats` - Dashboard statistics
- `GET /admin/users` - List all users
- `GET /admin/products` - List all products
- `GET /admin/orders` - List all orders

## 🌟 Key Features Explained

### AI Flower Grading Process
1. **Image Upload**: Sellers upload flower images
2. **AI Analysis**: CNN model analyzes multiple quality metrics
3. **Grading**: Automatic A, B, or C grade assignment
4. **Quality Control**: Only A and B grades are approved for sale
5. **Transparency**: Detailed metrics and explanations provided

### E-Commerce Workflow
1. **Seller Registration**: Sellers create accounts
2. **Product Submission**: Upload flowers with automatic grading
3. **Quality Approval**: AI ensures only premium flowers are listed
4. **Customer Browsing**: Customers view approved products
5. **Purchase**: Secure checkout and order management

### Admin Management
1. **User Management**: Add, update, and remove users
2. **Product Oversight**: Review and approve/reject submissions
3. **Analytics**: Monitor platform performance and revenue
4. **Order Tracking**: Manage complete order lifecycle

## 🎯 Use Cases

### For Flower Sellers
- Upload flower images for automatic quality assessment
- Get instant grading results with detailed metrics
- List only premium quality flowers (Grade A & B)
- Manage inventory and track sales

### For Customers
- Browse verified premium quality flowers
- View detailed quality metrics for each flower
- Secure shopping experience with quality assurance
- Track orders and delivery status

### For Platform Administrators
- Monitor platform performance and revenue
- Manage user accounts and permissions
- Oversee product quality and approvals
- Generate comprehensive analytics reports

## 🔧 Development

### Project Structure
```
FloraGrade/
├── backend/
│   ├── routers/          # API route handlers
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── auth.py          # Authentication logic
│   ├── main.py          # FastAPI application
│   └── flower_grader_api.py  # AI grading endpoints
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   └── App.jsx       # Main application
│   └── package.json
└── README.md
```

### Adding New Features
1. **Backend**: Add new models, schemas, and API endpoints
2. **Frontend**: Create new components and pages
3. **Testing**: Ensure all functionality works correctly
4. **Documentation**: Update API documentation and README

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `http://localhost:8000/docs`

## 🎉 Acknowledgments

- FastAPI for the excellent web framework
- React team for the amazing frontend library
- Tailwind CSS for the beautiful styling system
- PyTorch for the deep learning capabilities

---

**FloraGrade** - Where AI meets flower commerce for premium quality assurance. 🌸✨ 