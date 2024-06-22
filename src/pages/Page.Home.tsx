import React, { useState, useEffect } from 'react';
import { Button, Card, Dropdown, Space, message, MenuProps, Typography, Modal, Input, Row, Col, Spin } from 'antd';
import { DeleteOutlined, FileAddOutlined, FileDoneOutlined, ClockCircleOutlined, SettingOutlined, DownOutlined, WarningOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useAuth } from '../context/Context.Auth';
import { useTheme } from '../context/Context.Theme';

interface Task {
  id: string;
  title: any;
  description: any;
  status: string;
}

const PageHome: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [newDescription, setNewDescription] = useState<string>("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({ title: null, description: null, status: 'pending' });
  const [loading, setLoading] = useState<boolean>(true);

  const { token } = useAuth();
  const { currentTheme } = useTheme();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/task', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          message.error('Erro ao buscar tarefas');
        }
      } catch (error) {
        message.error('Erro ao buscar tarefas');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  const showEditModal = (task: Task) => {
    setSelectedTask(task);
    setNewDescription(task.description);
    setOpenEditModal(true);
  };

  const handleEditOk = async () => {
    if (selectedTask) {
      try {
        const response = await fetch(`http://localhost:3001/task/${selectedTask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ...selectedTask, description: newDescription })
        });
        if (response.ok) {
          setTasks(tasks.map(task => task.id === selectedTask.id ? { ...task, description: newDescription } : task));
          message.success('Tarefa atualizada com sucesso!');
        } else {
          message.error('Erro ao atualizar tarefa');
        }
      } catch (error) {
        message.error('Erro ao atualizar tarefa');
      }
    }
    setOpenEditModal(false);
  };

  const handleEditCancel = () => {
    setOpenEditModal(false);
  };

  const showCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCreateOk = async () => {
    try {
      const response = await fetch('http://localhost:3001/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });
      if (response.ok) {
        const createdTask: Task = await response.json();
        setTasks([...tasks, createdTask]);
        message.success(`Tarefa "${createdTask.title}" criada com sucesso!`);
        setOpenCreateModal(false);
      } else {
        const e = await response.json();
        console.log('e -> ', e);
        console.log("new task -> ", newTask);
        e.message?.forEach((element: any) => {
          message.error(element);
        });
        message.error('Erro ao criar tarefa');
      }
    } catch (error) {
      message.error('Erro ao criar tarefa');
    }
  };

  const handleCreateCancel = () => {
    setOpenCreateModal(false);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/task/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
        message.success('Tarefa excluída com sucesso!');
      } else {
        message.error('Erro ao excluir tarefa');
      }
    } catch (error) {
      message.error('Erro ao excluir tarefa');
    }
  };

  const items: MenuProps['items'] = [
    {
      label: 'completed',
      key: '1',
      icon: <FileDoneOutlined />,
    },
    {
      label: 'in-progress',
      key: '2',
      icon: <ClockCircleOutlined />,
    },
    {
      label: 'pending',
      key: '3',
      icon: <WarningOutlined />,
    },
  ];

  const handleMenuClick = async (e: any, task: Task) => {
    const selectedItem = items.find(item => item?.key === e.key);
    if (selectedItem && 'label' in selectedItem) {
      const updatedTask = { ...task, status: selectedItem.label as string };
      try {
        const response = await fetch(`http://localhost:3001/task/${task.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedTask)
        });
        if (response.ok) {
          setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
          message.info(`Status da tarefa "${task.title}" atualizado para "${selectedItem.label}" com sucesso!`);
        } else {
          message.error('Erro ao atualizar status da tarefa');
        }
      } catch (error) {
        message.error('Erro ao atualizar status da tarefa');
      }
    }
  };

  const getTitleBackgroundColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { div: '#4CAF50', font: '#FFFFFF' }; 
      case 'in-progress':
        return { div: '#FFC107', font: '#333333' }; 
      case 'pending':
        return { div: '#9E9E9E', font: '#FFFFFF' }; 
      default:
        return { div: '#FFFFFF', font: '#333333' };
    }
  };

  return (
    <div style={{ backgroundColor: currentTheme.backgroundColor, color: currentTheme.color }}>
      {loading ? (
        <Spin tip="Carregando as tarefas...">
          <div style={{ height: '100vh' }} />
        </Spin>
      ) : (
        <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]} style={{ width: '100%' }}>
          {tasks.map(task => (
            <Col className="gutter-row" xs={24} md={8} xl={6} key={task.id}>
              <Card
                key={task.id}
                style={{
                  backgroundColor: currentTheme.cardBackgroundColor,
                  color: currentTheme.color,
                  // Define uma variável CSS customizada para o background dos botões
                }}
                title={task.title}
                headStyle={{color: currentTheme.color }}
                bordered={false}
                extra={
                  <Dropdown
                    menu={{
                      items,
                      selectable: true,
                      defaultSelectedKeys: [task.status === 'completed' ? '1' : task.status === 'in-progress' ? '2' : '3'],
                      onClick: (e) => handleMenuClick(e, task)
                    }}
                  >
                    <Typography.Link>
                      <Space>
                        <div style={{ backgroundColor: getTitleBackgroundColor(task.status).div, paddingLeft: '10px', paddingRight: '10px', paddingBottom: '4px', borderRadius: '10px' }}>
                          <a style={{ color: getTitleBackgroundColor(task.status).font, fontSize: "8px" }}><b>{task.status}</b></a>
                        </div>
                        <DownOutlined />
                      </Space>
                    </Typography.Link>
                  </Dropdown>
                }
                actions={[
                  <SettingOutlined key="Setting" onClick={() => showEditModal(task)} />,
                  <DeleteOutlined key="Delete" onClick={() => handleDeleteTask(task.id)}  />,
                ]}
                
              >
                <p>{task.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Modal
        open={openEditModal}
        title="Deseja alterar a descrição da tarefa?"
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        footer={[
          <Button key="back" onClick={handleEditCancel}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleEditOk}>
            Ok
          </Button>,
        ]}
      >
        <TextArea
          rows={4}
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          />
        </Modal>
  
        <Modal
          open={openCreateModal}
          title="Criar nova tarefa"
          onOk={handleCreateOk}
          onCancel={handleCreateCancel}
          footer={[
            <Button key="back" onClick={handleCreateCancel}>
              Cancelar
            </Button>,
            <Button key="submit" type="primary" onClick={handleCreateOk}>
              Ok
            </Button>,
          ]}
        >
          <Input
            placeholder="Título da tarefa"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={{ marginBottom: '16px' }}
          />
          <TextArea
            placeholder="Descrição da tarefa"
            rows={4}
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
        </Modal>
  
        <Button type="primary" style={{ position: "fixed", bottom: "16px", left: "16px", backgroundColor: currentTheme.buttonColor, color: currentTheme.buttonTextColor }} icon={<FileAddOutlined />} onClick={showCreateModal}>
          Adicionar Tarefa
        </Button>
      </div>
    );
  };
  
  export default PageHome;